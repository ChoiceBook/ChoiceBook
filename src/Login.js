// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import './Login.css';

function Login({ setIsLoggedIn, setIsLoginVisible, onLoginSuccess, onRegisterClick }) { // props 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      if (userData.userId) {
        login(userData); // Update AuthContext with userData
        setIsLoggedIn(true);
        setIsLoginVisible(false);
        setErrorMessage('');
        onLoginSuccess();
      } else {
        throw new Error('User ID not found in the response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred during login'); // 에러 메시지 설정
    }
  };

  return (
    <div className="postcard-container">
      <img src="/postcard2.jpg" alt="PostCard" className="postcard-image" />
      <div className="content-container">
    <div className="login-container">
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
        <button type="login" className="login-button">Log In</button>
        <button type="button" className="signup-button" onClick={onRegisterClick}>Sign Up</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* 에러 메시지 표시 */}
    </div>
    <div className="text-container-login">
          <p>자신에 대해 더 깊이 <br />알 수 있는 시간이 되길 바라며...</p>
        </div>
    </div>
    </div>
  );
}

export default Login;
