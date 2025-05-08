import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';  // 경로 수정
import SuccessPage from './pages/success/SuccessPage'; // 성공 페이지 경로도 확인
import EditorPage from './pages/diary/diaryEditor/DiaryEditorPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
