// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './api';
import './Login.css';

function Login({ setIsLoggedIn, setIsLoginVisible, onLoginSuccess, onRegisterClick }) { // props 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      login(userData);
      setIsLoggedIn(true); // 로그인 상태 업데이트
      setIsLoginVisible(false); // 로그인 폼 숨기기
      setErrorMessage(''); // 에러 메시지 초기화
      onLoginSuccess(); // 로그인 성공 시 호출
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred during login'); // 에러 메시지 설정
    }
  };

  return (
    <div className="login-container">
      <h2>Let's Get Started!</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="login-button">Log In</button>
        <button type="button" className="signup-button" onClick={onRegisterClick}>Sign Up</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* 에러 메시지 표시 */}
    </div>
  );
}

export default Login;
