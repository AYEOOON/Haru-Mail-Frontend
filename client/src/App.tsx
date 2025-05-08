import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import SuccessPage from './pages/success/SuccessPage';
import ListPage from './pages/diary/list/ListPage';
import SettingPage from './pages/setting/MailSettingPage';
import EditorPage from './pages/diary/diaryEditor/DiaryEditorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
