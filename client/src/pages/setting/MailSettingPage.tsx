import React, { useEffect, useState } from 'react';
import Header from '../header/Header'; // Header 컴포넌트 경로
import './MailSettingPage.css';

const MailSetting: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('daily');
  const [token, setToken] = useState<string>(''); // 토큰 상태 추가

  // 쿠키에서 토큰을 읽는 함수
  const getAccessTokenFromCookies = (): string => {
    const name = 'accessToken=';
    const decoded = decodeURIComponent(document.cookie);
    return decoded
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.substring(name.length) ?? '';
  };

  // 마운트 시 토큰 상태로 저장
  useEffect(() => {
    const accessToken = getAccessTokenFromCookies();
    setToken(accessToken);
  }, []);

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

    if (!token) {
      console.log('로그인된 사용자가 아닙니다.');
      alert('로그인 후 다시 시도해 주세요.');
      return;
    }

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
    }
  };

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
