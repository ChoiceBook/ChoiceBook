// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports
import FlipbookWithLogin from './FlipbookWithLogin';
import CreateTest from './CreateTest';
import SearchPage from './SearchPage';
import { AuthProvider } from './AuthContext'; // AuthProvider 추가
import './App.css'; // Ensure this path is correct

function App() {
  const appStyle = {
    height: '100vh',
    margin: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    backgroundImage: 'url(/newspaper.jpg)', // Inline style
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="App" style={appStyle}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FlipbookWithLogin />} />
            <Route path="/create-test" element={<CreateTest />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;