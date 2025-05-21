import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');

    // 쿠키에서 토큰을 읽는 함수
    const getAccessTokenFromCookies = (): string => {
        const name = 'accessToken=';
        const decoded = decodeURIComponent(document.cookie);
        return decoded
            .split('; ')
            .find((row) => row.startsWith(name))
            ?.substring(name.length) ?? '';
    };

    // 마운트 시 토큰을 상태로 저장
    useEffect(() => {
        const accessToken = getAccessTokenFromCookies();
        setToken(accessToken);
    }, []);

    const handleLogout = async () => {
        if (!token) {
            console.log('로그인 상태가 아닙니다.');
            navigate('/'); // 또는 로그인 페이지 경로
            return;
        }

        try {
            const logoutRes = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!logoutRes.ok) {
                const errorData = await logoutRes.json();
                console.error('로그아웃 실패:', errorData);
                alert('로그아웃에 실패했습니다.');
                return;
            }

            // 로그아웃 성공 처리
            console.log('로그아웃 성공');
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate('/');
        } catch (error) {
            console.error('로그아웃 처리 중 오류 발생:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <header className="header">
            <Link to="/" className="logo">하루 메일</Link>
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
