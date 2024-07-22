// src/FlipbookWithLogin.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css';
import './Login.css';
import Login from './Login';
import TextPage from './TextPage';

const FlipbookWithLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const flipbookRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setIsLockHidden(true);
    }
  }, []);

  const handleLockClick = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const handleLogout = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().turnToPage(0);
    }
    const logoutButton = document.querySelector('.logout-button');
    const lockIcon = document.querySelector('.lock-icon');
      if (logoutButton) {
        logoutButton.classList.add('fade-out');
      }
      if (lockIcon) {
        lockIcon.classList.add('fade-in');
      }
      setTimeout(() => {
        if (logoutButton) {
          logoutButton.classList.remove('fade-out');
        }
        if (lockIcon) {
          lockIcon.classList.remove('fade-in');
        }
        setIsLoggedIn(false);
        setIsLockHidden(false);
        localStorage.setItem('isLoggedIn', 'false');
      }, 1000); // Match the duration of the CSS transition
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태를 로컬 스토리지에 저장

    const lockIcon = document.querySelector('.lock-icon');
    const logoutButton = document.querySelector('.logout-button');
    if (lockIcon) {
      lockIcon.classList.add('fade-out'); // Add fade-out class
      if (logoutButton) {
        logoutButton.classList.add('fade-in');
      }
      setTimeout(() => {
        setIsLockHidden(true);
        if (logoutButton) {
          logoutButton.classList.add('fade-in');
        }
        lockIcon.classList.remove('fade-out'); // Clean up class after transition
      }, 1000); // Match the duration of the CSS transition
    }
  };

  const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타"];

  const generatePages = () => {
    const pages = [
      <TextPage key="cover-page" isCoverPage={true} title="Memorial Diary" isFirstPage={true} plotId={null} categoryId={null} />
    ];

    for (let chapter = 0; chapter < chapterNames.length; chapter++) {
      const categoryId = chapter + 1;

      for (let i = 1; i <= 3; i++) {
        pages.push(
          <TextPage 
            key={`chapter-${chapterNames[chapter]}-page-${i}`} 
            number={`${chapterNames[chapter]} - Page ${i}`} 
            soft={true}
            isCoverPage={false}
            chapter={chapterNames[chapter]}
            plotId={1}
            categoryId={categoryId}
          />
        );
      }
    }

    pages.push(
      <TextPage
        key="final-page"
        isCoverPage={true}
        title="나의 취향을 담는 곳, Memorial Diary"
        isLastPage={true}
        plotId={null}
        categoryId={null}
      />
    );

    return pages;
  };

  const handleChapterNavigation = (chapterIndex) => {
    if (flipbookRef.current) {
      const pageIndex = chapterIndex * 3;
      flipbookRef.current.pageFlip().turnToPage(pageIndex);
    }
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handlePostCardClick = () => {
    navigate('/post-card');
  };

  const handlePenClick = () => {
    navigate('/create-test');
  };

  return ( 
    <div className="flipbook-wrapper">
      <div className="login-section">
        {!isLoggedIn && isLoginVisible && (
          <Login setIsLoggedIn={setIsLoggedIn} setIsLoginVisible={setIsLoginVisible} onLoginSuccess={handleLoginSuccess} /> // 상태 전달
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
            {generatePages()}
          </HTMLFlipBook>
        </div>

      <div className={`navigation-icons ${!isLoggedIn ? 'locked' : 'active'}`}>
        <button className="nav-icon top-left postcard" onClick={handlePostCardClick}>
        <img src="/postcard2.jpg" alt="PostCard" className="postcard-image" />
        <div className="profile-overlay">
      <img src="/profile.png" alt="Profile" />
        </div>
        </button>
        <button className="nav-icon top-right search" onClick={handleSearchClick}>
          <img src="/glass.png" alt="Search" />
        </button>
        <button className="nav-icon bottom-left pen" onClick={handlePenClick}>
        <img src="/pen3.png" alt="Pen" />
        </button>
      </div>

      <div className="nav-bar">
        {chapterNames.map((chapterName, index) => (
          <button
            key={index}
            className="nav-button"
            onClick={() => handleChapterNavigation(index + 1)}
          >
            {chapterName}
          </button>
        ))}
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
