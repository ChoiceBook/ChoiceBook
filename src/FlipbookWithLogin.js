import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css'; // Import the stylesheet
import './Login.css'; // Import the login stylesheet
import TextPage from './TextPage'; // Import the TextPage component

const FlipbookWithLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const flipbookRef = useRef(null);
  const navigate = useNavigate(); // Define navigate

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLockHidden(loggedIn);
  }, []);

  const handleLockClick = () => {
    setIsLoginVisible(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    setIsLockHidden(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().turnToPage(0); // Flip to the cover page
    }
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLockHidden(false);
      localStorage.setItem('isLoggedIn', 'false');
    }, 700); // Delay to match the flipping time
  };

  const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타"];

  const generatePages = () => {
    // Add the main cover page
    const pages = [
      <TextPage key="cover-page" isCoverPage={true} title="Memorial Diary" plotId={null} categoryId={null} /> // Main cover page
    ];
  
    // Generate pages for each chapter
    for (let chapter = 0; chapter < chapterNames.length; chapter++) {
      const categoryId = chapter + 1; // Example category ID; adjust if needed
  
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
  
    // Add the final cover page
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

  const handleStudentCardClick = () => {
    navigate('/student-card'); // Update this to the correct route
  };

  const handlePenClick = () => {
    navigate('/create-test'); // Update this to the correct route
  };

  const handleClockClick = () => {
    navigate('/clock'); // Update this to the correct route
  };

  return (
    <div className="flipbook-wrapper">
      {/* Login popup */}
      {isLoginVisible && (
        <div className="login-overlay active">
          <div className="login-popup">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Lock icon */}
      <div className={`flipbook-lock-container`} onClick={(e) => e.stopPropagation()}>
        {!isLockHidden && (
          <div className="lock-icon" onClick={handleLockClick}>
            🔒
          </div>
        )}

        <div className={`flipbook-container ${isLoggedIn ? '' : 'locked'}`}>
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
            disableFlip={true}
          >
            {generatePages()}
          </HTMLFlipBook>
        </div>
      </div>

      {/* Navigation icons */}
      <div className="navigation-icons">
        <button className="nav-icon top-left" onClick={handleStudentCardClick}>
          🏫 {/* Replace with the actual icon/image */}
        </button>
        <button className="nav-icon top-right search" onClick={handleSearchClick}>
          <img src="/glass.png" alt="Search" />
        </button>
        <button className="nav-icon bottom-left pen" onClick={handlePenClick} style={{ width: '100px', height: '100px' }}>
        <img src="/pen3.png" alt="Pen" />
        </button>
        <button className="nav-icon bottom-right clock" onClick={handleClockClick}>
        <img src="/clock.png" alt="Clock" />
        </button>
      </div>

      {/* Navigation bar */}
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

    </div>
  );
};

export default FlipbookWithLogin;