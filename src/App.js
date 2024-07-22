// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports
import FlipbookWithLogin from './FlipbookWithLogin';
import CreateTest from './CreateTest';
import SearchPage from './SearchPage';
import { AuthProvider } from './AuthContext'; // AuthProvider 추가
import './App.css'; // Ensure this path is correct

function App() {
  return (
    <AuthProvider> {/* AuthProvider로 Router를 감쌉니다 */}
      <Router>
        <Routes>
          <Route path="/" element={<FlipbookWithLogin />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
