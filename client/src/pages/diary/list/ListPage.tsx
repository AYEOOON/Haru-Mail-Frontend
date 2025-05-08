import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';  // Header 컴포넌트 경로
import './ListPage.css';
import { useNavigate } from 'react-router-dom';

interface DiaryItem {
  id: number;
  title: string;
  createdAt: string;
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

  // 쿠키에서 accessToken 꺼내는 함수
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

  useEffect(() => {
    async function fetchData() {
      const token = getAccessTokenFromCookies();
      try {
        // 1) 사용자 정보 호출
        const userRes = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (!userRes.ok) throw new Error('User fetch failed');
        const userData: UserInfo = await userRes.json();
        setUser(userData);

        // 2) 일기 목록 호출
        const diaryRes = await fetch('http://localhost:8080/diary/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (!diaryRes.ok) throw new Error('Diary list fetch failed');
        const diaryData: DiaryItem[] = await diaryRes.json();
        setDiaries(diaryData);
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="webpage-layout">
      <Header /> {/* 공통 헤더 사용 */}

      <main className="webpage-container">
        <h2>
          <span className="username">{user?.username ?? '사용자'}</span> 님이 작성하신 일기 목록이에요!
        </h2>

        <div className="calendar-header">
          <button className="arrow">&lt;</button>
          <span className="month-label">2025년 3월</span>
          <button className="arrow">&gt;</button>
        </div>

        <button className="query-button">조회</button>

        <section id="diary-list" className="diary-list">
          {diaries.length === 0 ? (
            <p className="empty">작성된 일기가 없습니다.</p>
          ) : (
            diaries.map(diary => {
              const date = new Date(diary.createdAt);
              return (
                <div key={diary.id} className="diary-item">
                  <div className="date-tag">{date.getDate()}일</div>
                  <div className="diary-title">{diary.title}</div>
                  <div className="arrow">→</div>
                </div>
              );
            })
          )}
        </section>
        <button className="write-button"
        onClick={() => navigate('/editor')}
        >일기 작성하기 ✏️</button>
      </main>
    </div>
  );
};

export default ListPage;
