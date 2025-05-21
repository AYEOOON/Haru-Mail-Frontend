import React, { useState } from 'react';
import './HomePage.css';

const WebPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSubscribeClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoogleLogin = () => {
    if (!isAgreed) return;

    // 로그인 전에 사용자 설정 정보 임시 저장
    localStorage.setItem("subscription_frequency", selectedFrequency);
    localStorage.setItem("subscription_agreement", isAgreed);

    // 구글 OAuth로 이동
    window.location.href = "http://localhost:8080/login/oauth2/code/google";
  };

  // 기존 로그인과 별도로 단순 로그인용 함수 추가
  const handleJustLogin = () => {
    // 수신 주기 정보 없이 로그인만 수행
    window.location.href = "http://localhost:8080/login/oauth2/code/google";
  };

  return (
    <div className="webpage-layout">
      <header className="webpage-header">
        <div className="header-content">
          <a href="/" className="homepage-logo" style={{ textDecoration: 'none' }}>
            <h2>하루 메일</h2>
          </a>
          <button className="login-button" onClick={handleJustLogin}>로그인</button>
        </div>
      </header>

      <div className="webpage-container">
        <main className="webpage-main">
          <div className="text-section">
            <h2 className="main-title">매일매일 새로운 질문들로 하루를 마무리 해보세요!</h2>
            <p className="main-subtitle">당신의 메일로 매일 다른 질문을 보내드릴게요.</p>
            <button className="subscribe-button" onClick={handleSubscribeClick}>
              구독하러 가기<span role="img" aria-label="hands">🙌</span>
            </button>
          </div>
          <div className="image-section">
            <img
              src="/images/mainImg.png"
              alt="일기장에 누워있는 사람"
              className="main-image"
            />
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>하루 일기 구독</h2>
            <p>메일 수신 빈도를 선택해주세요!</p>
            <div className="frequency-options">
              <label className="frequency-option">
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={selectedFrequency === 'daily'}
                  onChange={() => setSelectedFrequency('daily')}
                />
                <span className="custom-checkbox">🐥 매일</span>
              </label>
              <label className="frequency-option">
                <input
                  type="radio"
                  name="frequency"
                  value="every_other_day"
                  checked={selectedFrequency === 'every_other_day'}
                  onChange={() => setSelectedFrequency('every_other_day')}
                />
                <span className="custom-checkbox">🐢 격일</span>
              </label>
              <label className="frequency-option">
                <input
                  type="radio"
                  name="frequency"
                  value="weekly"
                  checked={selectedFrequency === 'weekly'}
                  onChange={() => setSelectedFrequency('weekly')}
                />
                <span className="custom-checkbox">🐻 주 1회</span>
              </label>
            </div>
            <label className="agree-checkbox">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span> 메일 수신에 동의합니다.</span>
            </label>

            {!isAgreed && (
              <p className="warning-text">메일 수신에 동의해야 시작할 수 있어요.</p>
            )}

            <button
              className={`google-login ${!isAgreed ? 'disabled' : ''}`}
              onClick={handleGoogleLogin}
              disabled={!isAgreed}
            >
              Google Mail로 시작하기!
            </button>
            <button className="close-button" onClick={handleCloseModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebPage;