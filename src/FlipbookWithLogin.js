// src/FlipbookWithLogin.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css';
import './Login.css';
import Login from './Login';
import Register from './Register'; // Register 컴포넌트 추가
import TextPage from './TextPage';
import { fetchPlots, fetchRanks, fetchItemDetails } from './api'; // Import data fetching functions

const categories = [
  { id: 1, name: '드라마' },
  { id: 2, name: '영화' },
  { id: 3, name: '게임' },
  { id: 4, name: '애니메이션' },
  { id: 5, name: '음악' },
  { id: 6, name: '음식' },
  { id: 7, name: '스포츠' },
  { id: 8, name: '기타' }
];

const FlipbookWithLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // 회원가입 상태 추가
  const flipbookRef = useRef(null);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setIsLockHidden(true);
    }

    const loadData = async () => {
      try {
        const generatedPages = [];
        // Add front cover
        generatedPages.push(
          <TextPage key="front-cover" isCoverPage={true} isFirstPage={true} title="Memorial Diary" />
        );

        for (const category of categories) {
          const plots = await fetchPlots(category.id);

          // Add a chapter page for the category
          generatedPages.push(
            <TextPage
              key={`chapter-${category.id}`}
              title={category.name}
              content={<div />} // Add your content here
              chapterPage={true} // Apply the chapter-page styles
              isCoverPage={false} // Adjust these based on your requirements
              isFirstPage={false}
              isLastPage={false}
            />
          );
          

        // Fetch user ranks for each plot
        const plotDataPromises = plots.map(async (plot) => {
          const ranks = await fetchRanks(plot.plot_id, 1); // Assuming user ID is 1
          
          // Fetch item details based on ranks
          const itemsPromises = ranks.map(async (rank) => {
            const itemDetails = await fetchItemDetails(rank.item_id);
            return { ...itemDetails[0], rank_value: rank.rank_value }; // Add rank to item details
          });

          const items = await Promise.all(itemsPromises);
          return {
            title: plot.title,
            items: items.sort((a, b) => a.rank_value - b.rank_value), // Sort items by rank
          };
        });

        const plotData = await Promise.all(plotDataPromises);

        // Add plot pages
        plotData.forEach((data, index) => {
          generatedPages.push(
            <TextPage
              key={`plot-${index}`}
              title={data.title}
              content={
                <div>
                  {data.items.map(item => (
                    <div key={item.item_id} className="item-row">
                    <div className="item-info">
                      <h2>{item.rank_value}.</h2>
                      <p>{item.item_name}</p>
                    </div>
                    <div className="item-image-container">
                      <img src={item.item_image_url} alt={item.item_name} className="item-image" /> {/* Display image */}
                    </div>
                  </div>
                  ))}
                </div>
              }
            />
          );
        });
      }
      
        // Add back cover
        generatedPages.push(
          <TextPage key="back-cover" isCoverPage={true} isLastPage={true} />
        );
        
        setPages(generatedPages);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
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

  const handleRegisterClick = () => {
    setIsRegistering(true); // 회원가입 창으로 전환
  };

  const handleBackToLoginClick = () => {
    setIsRegistering(false); // 로그인 창으로 전환
  };

  const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타"];
  
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

      {isLoggedIn && (
        <button className="logout-button fade-in" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default FlipbookWithLogin;
