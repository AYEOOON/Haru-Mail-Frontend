import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">하루 메일</div>
            <nav className="nav">
                <Link to="/list">일기 목록</Link>
                <Link to="/search">일기 검색</Link>
                <Link to="/setting">설정</Link>
                <Link to="/logout">로그아웃</Link>
            </nav>
        </header>
    );
};

export default Header;