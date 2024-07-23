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
