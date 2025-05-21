import React, { useState } from 'react';
import './HomePage.css';

const WebPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

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
            <h2>구독을 위한 로그인</h2>
            <button className="google-login" onClick={handleGoogleLogin}>
              Google로 로그인하기
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