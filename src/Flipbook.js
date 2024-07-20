import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css'; // Import the stylesheet

import Login from './Login'; // Import the Login component

const SearchPage = React.forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <div className="flipbook-page" ref={ref} data-density={props.soft ? "soft" : "hard"}>
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

const TextPage = React.forwardRef((props, ref) => {
  return (
    <div className="flipbook-page" ref={ref} data-density={props.soft ? "soft" : "hard"}>
      <div className="text-box" onClick={(e) => { e.stopPropagation(); alert(`Clicked on text box 1 of page ${props.number}`); }}>Text Box 1</div>
      <div className="text-box" onClick={(e) => { e.stopPropagation(); alert(`Clicked on text box 2 of page ${props.number}`); }}>Text Box 2</div>
      <div className="text-box" onClick={(e) => { e.stopPropagation(); alert(`Clicked on text box 3 of page ${props.number}`); }}>Text Box 3</div>
    </div>
  );
});

const Flipbook = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const flipbookRef = useRef(null);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="flipbook-wrapper">
      {!isLoggedIn && (
        <div className="lock-container">
          <div className="lock-icon" onClick={() => document.querySelector('.login-overlay').style.display = 'block'}>
            🔒
          </div>
          <Login onSuccess={handleLoginSuccess} />
        </div>
      )}
      
      <div className={`sidebar ${isSidebarOpen && isLoggedIn ? 'open' : ''}`}>
        <div className="sidebar-content">
          <span className="sidebar-close-btn" onClick={toggleSidebar}>
            &times;
          </span>
          <Link to="/create-test" className="create-test-btn">Create Test</Link>
        </div>
      </div>

      <div className={`flipbook-with-nav ${isLoggedIn ? 'fade-in' : ''}`}>
        <div className="flipbook-container">
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

        {/* Navigation Bar */}
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
    </div>
  );
};

export default Flipbook;
