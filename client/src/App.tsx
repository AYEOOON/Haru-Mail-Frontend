import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';  // 메인 페이지
import TestPage from './pages/success/SuccessPage';  // 성공 페이지
import ListPage from './pages/diary/list/ListPage';  // 사용자 일기 목록 페이지
import SettingPage from './pages/setting/MailSettingPage';  // 메일 수신 빈도 설정 페이지


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
