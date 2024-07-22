// src/components/Auth/Register.js
import React, { useState } from 'react';
import api from './api';
import './Register.css';

function Register({ onBackToLoginClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, username });
      alert('Registration successful! Please log in.');
      onBackToLoginClick(); // 회원가입 성공 시 로그인 창으로 전환
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit" className="register-button">Sign Up</button>
        <button type="button" className="back-button" onClick={onBackToLoginClick}>Back to Login</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* 에러 메시지 표시 */}
    </div>
  );
}

export default Register;
