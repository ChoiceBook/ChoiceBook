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
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLockHidden(false);
      localStorage.setItem('isLoggedIn', 'false');
    }, 700);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태를 로컬 스토리지에 저장
    setTimeout(() => {
      setIsLockHidden(true);
    }, 1500);
  };

  const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타"];

  const generatePages = () => {
    const pages = [
      <TextPage key="cover-page" isCoverPage={true} title="Memorial Diary" plotId={null} categoryId={null} />
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
            <div className={`lock-icon ${isLoggedIn ? 'unlocked' : ''}`} onClick={handleLockClick}>
              {isLoggedIn ? '🔓' : '🔒'}
            </div>
          )}
        </div>
        <HTMLFlipBook
          width={700}
          height={800}
          size="stretch"
          minWidth={315}
          maxWidth={700}
          minHeight={420}
          maxHeight={1350}
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
          <img src="/postcard.png" alt="PostCard" />
        </button>
        <button className="nav-icon top-right search" onClick={handleSearchClick}>
          <img src="/glass.png" alt="Search" />
        </button>
        <button className="nav-icon bottom-left pen" onClick={handlePenClick} style={{ width: '100px', height: '100px' }}>
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
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default FlipbookWithLogin;
