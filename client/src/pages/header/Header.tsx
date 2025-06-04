import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const navRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null); // headerRef는 현재 사용되지 않지만, 외부 클릭 로직에 포함되어 있어 남겨둡니다.

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

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // 메뉴가 열려 있고, nav 영역 밖을 클릭했을 때 닫음
            // headerRef는 햄버거 메뉴 자체를 포함하므로, 이 조건에서 제외하는 것이 일반적입니다.
            if (
                menuOpen &&
                navRef.current &&
                !navRef.current.contains(target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        if (!token) {
            console.log('로그인 상태가 아닙니다.');
            // 사용자가 이미 로그아웃 상태라면 알림 후 홈으로 이동
            alert('이미 로그아웃되었습니다.'); // 추가: 이미 로그아웃된 경우 안내
            navigate('/');
            return;
        }

        try {
            const logoutRes = await fetch('http://localhost:8080/api/auth/logout', {
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
            setToken(''); // 토큰 상태 초기화
            alert('로그아웃되었습니다.'); // 추가: 로그아웃 성공 알림
            navigate('/');
        } catch (error) {
            console.error('로그아웃 처리 중 오류 발생:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <header className="header">
            <Link to="/" className="header-logo">하루 메일</Link>

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                    <span className="close-icon">×</span>
                ) : (
                    <>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </>
                )}
            </div>

            <nav ref={navRef} className={`nav ${menuOpen ? 'open' : ''}`}>
                <Link to="/list">일기 목록</Link>
                <Link to="/search">일기 검색</Link>
                <Link to="/setting">설정</Link>
                {/* 토큰이 있을 때만 로그아웃 버튼을 표시하도록 조건부 렌더링 */}
                {token ? (
                    <button className="logout-button" onClick={handleLogout} id="logout-btn">로그아웃</button>
                ) : (
                    // 토큰이 없을 때 로그인 버튼을 표시 (선택 사항)
                    <button className="login-button" onClick={() => navigate('/login')}>로그인</button> // '로그인' 페이지 경로에 맞게 수정
                )}
            </nav>

            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
        </header>
    );
};

export default Header;