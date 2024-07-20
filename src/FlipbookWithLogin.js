import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css'; // Import the stylesheet
import './Login.css'; // Import the login stylesheet
import TextPage from './TextPage'; // Import the TextPage component

const SearchPage = React.forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from affecting the flipbook
  };

  return (
    <div className="flipbook-page" ref={ref} data-density={props.soft ? "soft" : "hard"} onClick={handleClick}>
      <h2>Chapter {props.chapter}</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
});

const FlipbookWithLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const flipbookRef = useRef(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLockHidden(loggedIn);
  }, []);

  const handleLockClick = () => {
    setIsLoginVisible(true);
  };

  const handleFlipbookClick = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().flipNext();
    }
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
      setIsSidebarOpen(false);
    }, 700); // Delay to match the flipping time
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generatePages = () => {
    const pages = [];
    for (let chapter = 1; chapter <= 8; chapter++) {
      pages.push(<SearchPage key={`chapter-${chapter}-search`} chapter={chapter} soft={true} />);
      for (let i = 1; i <= 3; i++) {
        pages.push(<TextPage key={`chapter-${chapter}-page-${i}`} number={`Chapter ${chapter} - Page ${i}`} soft={true} />);
      }
    }
    return pages;
  };

  const handleChapterNavigation = (chapterIndex) => {
    if (flipbookRef.current) {
      const pageIndex = chapterIndex * 4 - 1;
      flipbookRef.current.pageFlip().turnToPage(pageIndex);
    }
  };

  return (
    <div className="flipbook-wrapper">
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <span className="sidebar-close-btn" onClick={toggleSidebar}>
            &times;
          </span>
          {isLoggedIn ? (
            <>
              <Link to="/create-test" className="create-test-btn">Create Test</Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <p className="login-message">로그인이 필요합니다.</p>
          )}
        </div>
      </div>

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

      <div className="flipbook-lock-container" onClick={handleFlipbookClick}>
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
          >
            {generatePages()}
          </HTMLFlipBook>
        </div>
      </div>

      <div className={`nav-bar ${isLoggedIn ? 'fade-in' : ''}`}>
        {[...Array(8).keys()].map((index) => (
          <button
            key={index}
            className="nav-button"
            onClick={() => handleChapterNavigation(index + 1)}
          >
            Chapter {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlipbookWithLogin;
