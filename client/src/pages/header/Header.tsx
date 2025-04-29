import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">하루 메일</div>
            <nav className="nav">
                <a href="#">일기 목록</a>
                <a href="#">일기 검색</a>
                <a href="#">설정</a>
                <a href="#">로그아웃</a>
            </nav>
        </header>
    );
};

export default Header;