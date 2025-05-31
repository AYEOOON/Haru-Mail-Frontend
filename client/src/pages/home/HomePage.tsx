import React, { useState, useEffect, useRef, useCallback } from 'react'; // useCallback 추가
import './HomePage.css';

const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [isAgreed, setIsAgreed] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const contentItemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [visibleContentItems, setVisibleContentItems] = useState<Record<string, boolean>>({});

  const sectionObserverCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      if (entry.isIntersecting) {
        setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
      } else {
        setVisibleSections(prev => ({ ...prev, [sectionId]: false }));
      }
    });
  }, []);
  const contentItemObserverCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const itemId = entry.target.id;
      if (entry.isIntersecting) {
        setVisibleContentItems(prev => ({ ...prev, [itemId]: true }));
      }
    });
  }, []);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(sectionObserverCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    });

    sectionRefs.current.forEach(section => {
      if (section) {
        sectionObserver.observe(section);
      }
    });

    const contentItemObserver = new IntersectionObserver(contentItemObserverCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    });

    Object.values(contentItemRefs.current).forEach(item => {
      if (item) {
        contentItemObserver.observe(item);
      }
    });

    return () => {
      sectionRefs.current.forEach(section => {
        if (section) {
          sectionObserver.unobserve(section);
        }
      });
      Object.values(contentItemRefs.current).forEach(item => {
        if (item) {
          contentItemObserver.unobserve(item);
        }
      });
    };
  }, [sectionObserverCallback, contentItemObserverCallback]);

  const setContentItemRef = useCallback((el: HTMLElement | null, id: string) => {
    if (el) {
      contentItemRefs.current[id] = el;
    }
  }, []);


  const handleSubscribeClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoogleLogin = () => {
    if (!isAgreed) return;

    localStorage.setItem("subscription_frequency", selectedFrequency);
    localStorage.setItem("subscription_agreement", String(isAgreed));

    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleJustLogin = () => {
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

      <section
        ref={el => sectionRefs.current[0] = el}
        id="section-0"
        className={`scroll-section ${visibleSections['section-0'] ? 'is-visible' : ''}`}
      >
        <h2 className="scroll-section-title">하루메일은 말이죠..</h2>
        <p className="scroll-section-subtitle">
          바쁜 일상 속, 숨 쉴 틈 한 줌! <br />
          하루 한 번, 이메일로 당신의 하루를 기록할 수 있게 도와드릴게요.
        </p>
        <div className="scroll-section-content">
          <div
            id="item-0-0"
            ref={el => setContentItemRef(el, 'item-0-0')}
            className={`content-item ${visibleContentItems['item-0-0'] ? 'is-visible' : ''}`}
          >
            <div className="content-item-icon">
              <img src="/images/thinkingFace.png" alt="고민하는 사람 아이콘" />
            </div>
            <h3 className="content-item-title">어떤 주제로 기록하지?</h3>
            <p className="content-item-description">
              일기 쓰기가 막막할 때, 매일 도착하는 질문으로 하루를 돌아보고 의미 있게 마무리하세요.
            </p>
          </div>
          <div
            id="item-0-1"
            ref={el => setContentItemRef(el, 'item-0-1')}
            className={`content-item ${visibleContentItems['item-0-1'] ? 'is-visible' : ''}`}
          >
            <div className="content-item-icon">
              <img src="/images/mail.png" alt="메일 아이콘" />
            </div>
            <h3 className="content-item-title">매일 새로워지는 질문</h3>
            <p className="content-item-description">
              매일 다른 질문을 받아보며, 하루를 깊이 있게 성찰할 수 있습니다.
            </p>
          </div>
          <div
            id="item-0-2"
            ref={el => setContentItemRef(el, 'item-0-2')}
            className={`content-item ${visibleContentItems['item-0-2'] ? 'is-visible' : ''}`}
          >
            <div className="content-item-icon">
               <img src="/images/laptop.png" alt="노트북 사람 아이콘" />
            </div>
            <h3 className="content-item-title">꾸준한 기록 습관 만들기</h3>
            <p className="content-item-description">
              매일 꾸준히 기록하면서 자연스럽게 나만의 소중한 기록 습관을 만들어가세요.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={el => sectionRefs.current[1] = el}
        id="section-1"
        className={`scroll-section ${visibleSections['section-1'] ? 'is-visible' : ''}`}
      >
         <h2 className="scroll-section-title">하루메일과 함께 매일 새로운 질문이 도착!</h2>
         <p className="scroll-section-subtitle">
           메일함에 쏙! 들어오는 하루 기록 질문으로
           즐겁게 하루를 되돌아보세요.
         </p>
         <img
           src="/images/mailTemp.png"
           alt="일기 질문 메일링 예시"
           className="qna-board-image"
         />
      </section>


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

export default HomePage;