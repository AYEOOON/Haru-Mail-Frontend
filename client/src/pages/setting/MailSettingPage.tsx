import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import './MailSettingPage.css';
import { useNavigate } from 'react-router-dom';

const MailSetting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        setLoading(true);
        const userRes = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!userRes.ok) {
          // 인증 실패 (예: 401 Unauthorized) 시 로그인 페이지로 리다이렉트
          console.error('사용자 인증 실패:', userRes.status, userRes.statusText);
          alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/');
          return;
        }

      } catch (error) {
        console.error('인증 상태 확인 중 오류 발생:', error);
        alert('페이지 로딩 중 오류가 발생했습니다. 다시 로그인해주세요.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
  }, [navigate]);

  const mailOptions = [
    { value: 'daily', label: '매일 받아 볼래요! (주 7회)' },
    { value: '3times', label: '주 3회만 받을래요!' },
    { value: 'once', label: '주 1회만 받을래요!' },
    { value: 'never', label: '메일을 받지 않을래요!' },
  ];

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // handleSubmit 시점에서도 다시 한번 인증 확인 (불필요할 수 있지만, 확실성을 위해)
    // 혹은 API 호출 자체가 401을 반환할 때 처리
    try {
      const response = await fetch('http://localhost:8080/api/mail/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedOption }),
        credentials: "include",
      });

      if (!response.ok) {
        // API 호출 실패 시 로그인 페이지로 리다이렉트 (인증 문제로 가정)
        if (response.status === 401) {
          alert('세션이 만료되어 설정을 저장할 수 없습니다. 다시 로그인해주세요.');
          navigate('/');
          return;
        }
        const errorData = await response.json();
        console.error('설정 저장 실패:', errorData);
        alert('설정 저장에 실패했습니다.');
        return;
      }
      console.log(selectedOption)
      alert(`설정이 저장되었습니다: ${selectedOption}`);
    } catch (error) {
      console.error('서버와의 통신 중 오류 발생:', error);
      alert('서버와의 통신에 문제가 발생했습니다.');
      navigate('/');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="webpage-layout">
      <Header />

      <main className="mail-setting-main">
        <section className="mail-setting-content">
          <h2 className="title">메일 수신을 어떻게 하시겠어요?</h2>
          <form onSubmit={handleSubmit} className="form">
            {mailOptions.map((option) => (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={handleOptionChange}
                  className="radio-input"
                />
                <span className="custom-radio" />
                {option.label}
              </label>
            ))}
            <button type="submit" className="submit-button">설정하기</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default MailSetting;