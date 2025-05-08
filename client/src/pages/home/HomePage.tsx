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
    window.location.href = "http://localhost:8080/login/oauth2/code/google";
  };

  return (
    <div className="webpage-layout">
      <header className="webpage-header">
        <div className="header-content">
          <h1 className="homepage-logo">하루 메일</h1>
          <button className="login-button">로그인</button>
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