import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

        const handleLogout = async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    credentials: 'include', // 쿠키를 포함해 요청
                });

                if (response.ok) {
                    // 로그아웃 성공 시 로그인 페이지로 이동
                    navigate('/');
                } else {
                    console.error('로그아웃 실패');
                }
            } catch (error) {
                console.error('로그아웃 중 오류 발생:', error);
            }
        };

    return (
        <header className="header">
            <div className="logo">하루 메일</div>
                <nav className="nav">
                    <Link to="/list">일기 목록</Link>
                    <Link to="/search">일기 검색</Link>
                    <Link to="/setting">설정</Link>
                    <button onClick={handleLogout}>로그아웃</button>
                </nav>
        </header>
    );
};

export default Header;