// MailSetting.tsx
import React, { useState } from 'react';
import Header from '../header/Header'; // Header 컴포넌트 경로
import './MailSettingPage.css';

const MailSetting: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('daily');

  const mailOptions = [
    { value: 'daily', label: '매일 받아 볼래요! (주 7회)' },
    { value: '3times', label: '주 3회만 받을래요!' },
    { value: 'once', label: '주 1회만 받을래요!' },
    { value: 'never', label: '메일을 받지 않을래요!' },
  ];

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`설정이 저장되었습니다: ${selectedOption}`);
    // TODO: 서버에 POST 요청 보내기
  };

  return (
    <div className="webpage-layout">
      <Header /> {/* 헤더 컴포넌트 사용 */}

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
