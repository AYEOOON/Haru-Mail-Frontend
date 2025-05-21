import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import './ListPage.css';
import { useNavigate } from 'react-router-dom';

interface DiaryItem {
  id: number;
  title: string;
  date: string;
}

interface UserInfo {
  username: string;
  email: string;
}

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);

  const getAccessTokenFromCookies = (): string => {
    const name = 'accessToken=';
    const decoded = decodeURIComponent(document.cookie);
    return (
      decoded
        .split('; ')
        .find(row => row.startsWith(name))
        ?.substring(name.length) ?? ''
    );
  };

  // 이전 달
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 1) {
        setCurrentYear(prevYear => prevYear - 1);
        return 12;
      } else {
        return prevMonth - 1;
      }
    });
  };

  // 다음 달
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 12) {
        setCurrentYear(prevYear => prevYear + 1);
        return 1;
      } else {
        return prevMonth + 1;
      }
    });
  };

  useEffect(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1); // 월은 0부터 시작하므로 +1 필요
  }, []);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('accessToken');

      try {
        setLoading(true);
        // 1) 사용자 정보 호출
        const userRes = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!userRes.ok) {
          // 인증 실패(401) 또는 기타 오류 발생 시 로그인 페이지로 리다이렉트
          console.error('사용자 정보 호출 실패:', userRes.status, userRes.statusText);
          alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/');
          return;
        }
        const userData: UserInfo = await userRes.json();
        setUser(userData);

        // 2) 월과 연도를 쿼리 파라미터로 전달하여 일기 목록 호출
        const diaryRes = await fetch(
          `http://localhost:8080/diary/list?year=${currentYear}&month=${currentMonth}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!diaryRes.ok) {
          // 일기 목록 호출 실패 시 로그인 페이지로 리다이렉트 (인증 문제로 가정)
          console.error('일기 목록 호출 실패:', diaryRes.status, diaryRes.statusText);
          alert('일기 목록을 불러오는 데 실패했습니다. 다시 로그인해주세요.');
          navigate('/');
          return;
        }
        const diaryData: DiaryItem[] = await diaryRes.json();

        console.log('Received Diary Data:', diaryData);
        setDiaries(diaryData);
      } catch (error) {
        // 네트워크 오류 등 예상치 못한 오류 발생 시
        console.error('API 호출 중 오류 발생:', error);
        alert('페이지 로딩 중 오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    // currentYear와 currentMonth가 유효한 값일 때만 fetchData 호출
    if (currentYear !== 0 && currentMonth !== 0) {
        fetchData();
    }
  }, [currentYear, currentMonth, navigate]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="webpage-layout">
      <Header />

      <main className="webpage-container">
        <div className="header-container">
          <h2>
            <span className="username">{user?.username ?? '사용자'}</span> 님이 작성하신 일기 목록이에요!
          </h2>

          <div className="calendar-header">
            <button className="arrow" onClick={handlePrevMonth}>&lt;</button>
            <span className="month-label">
              {currentYear}년 {currentMonth}월
            </span>
            <button className="arrow" onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>

        <section id="diary-list" className="diary-list">
          {diaries.length === 0 ? (
            <p className="empty">작성된 일기가 없습니다.</p>
          ) : (
            diaries.map(diary => {
              const date = new Date(diary.date);
              return (
                <div
                  key={diary.id}
                  className="diary-item"
                  onClick={() => navigate(`/diary/${diary.id}`)}
                >
                  <div className="date-tag">{date.getDate()}일</div>
                  <div className="diary-title">{diary.title}</div>
                  <div className="arrow">→</div>
                </div>
              );
            })
          )}
        </section>

        <button className="write-button" onClick={() => navigate('/editor/제목 없음')}>
          일기 작성하기 ✏️
        </button>
      </main>
    </div>
  );
};

export default ListPage;