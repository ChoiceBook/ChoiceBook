import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css';
import './Login.css';
import Login from './Login';
import Register from './Register';
import { generatePages } from './generatePages';
import { useAuth } from './AuthContext'; // Import useAuth to get user info

const FlipbookWithLogin = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const flipbookRef = useRef(null);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (loading) return; // Wait until user data is loaded

    const loggedIn = !!user;

    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setIsLockHidden(true);
    }

    const loadData = async () => {
      if (!user) return; // Wait for user data to be available

      try {
        const generatedPages = await generatePages(user.userId);
        setPages(generatedPages.map((page, index) => (
          <div key={index}>
            {page}
          </div>
        )));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, loading]);

  const handleLockClick = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const handleLogout = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().turnToPage(0);
    }
    setIsLoggedIn(false);
    setIsLockHidden(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLockHidden(true);
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleBackToLoginClick = () => {
    setIsRegistering(false);
  };

  const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타"];
  const handleSearchClick = () => {
    if (isLoggedIn)
      navigate('/search');
  };

  const handlePenClick = () => {
    if (isLoggedIn)
      navigate('/create-test');
  };

  return (
    <div className="flipbook-wrapper">
      <div className="login-section">
        {!isLoggedIn && isLoginVisible && (
          isRegistering ? (
            <Register onBackToLoginClick={handleBackToLoginClick} />
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} setIsLoginVisible={setIsLoginVisible} onLoginSuccess={handleLoginSuccess} onRegisterClick={handleRegisterClick} />
          )
        )}
      </div>

      <div className={`flipbook-container ${!isLoggedIn ? 'locked' : ''}`}>
        <div className="flipbook-lock-container">
          {!isLockHidden && (
            <div className={`lock-icon ${isLoggedIn ? 'unlocked fade-out' : ''}`} onClick={handleLockClick}>
              {isLoggedIn ? '🔓' : '🔒'}
            </div>
          )}
        </div>
        <HTMLFlipBook
          width={500}
          height={700}
          size="stretch"
          minWidth={300}
          maxWidth={700}
          minHeight={400}
          maxHeight={800}
          drawShadow={true}
          flippingTime={700}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          swipeDistance={30}
          clickEventForward={false}
          useMouseEvents={true}
          renderOnlyPageLengthChange={false}
          ref={flipbookRef}
          disableFlip={!isLoggedIn}
        >
          {pages}
        </HTMLFlipBook>
      </div>

      <div className={`navigation-icons ${!isLoggedIn ? 'locked' : 'active'}`}>
        <button className="nav-icon top-right search" onClick={handleSearchClick}>
          <img src="/glass.png" alt="Search" />
        </button>
        <button className="nav-icon bottom-left pen" onClick={handlePenClick}>
          <img src="/pen3.png" alt="Pen" />
        </button>
      </div>

      {isLoggedIn && (
        <button className="logout-button fade-in" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default FlipbookWithLogin;
