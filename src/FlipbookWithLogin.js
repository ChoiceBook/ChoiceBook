import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';
import './Flipbook.css';
import './Login.css';
import Login from './Login';
import Register from './Register';
import CoverPage from './CoverPage'; // Import the CoverPage component
import { generatePages } from './generatePages';
import { useAuth } from './AuthContext'; // Import useAuth to get user info
import { fetchUsername } from './api'; // Import fetchUsername function

const FlipbookWithLogin = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isLockHidden, setIsLockHidden] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(''); // State to store username
  const flipbookRef = useRef(null);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [postcardImage, setPostcardImage] = useState('');

  useEffect(() => {
    if (loading) return; // Wait until user data is loaded
  
    const loggedIn = !!user;
  
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setIsLockHidden(true);
      fetchAndSetUsername(user.userId); // Fetch username when logged in
      postCardImage(); // 이미지 로드 함수 호출
    }
  
    const loadData = async () => {
      if (!user) return; // Wait for user data to be available
  
      try {
        if (loggedIn) {
          const generatedPages = await generatePages(user.userId);
          setPages(generatedPages.map((page, index) => (
            <div key={index}>
              {page}
            </div>
          )));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
  
    loadData();
  }, [user, loading]);

  const fetchAndSetUsername = async (userId) => {
    try {
      console.log('Fetching username for userId:', userId); // Debugging log
      const userDataArray = await fetchUsername(userId);
      console.log('Fetched userData:', userDataArray); // Debugging log
      if (userDataArray.length > 0) {
        const userData = userDataArray[0]; // Get the first item in the array
        setUsername(userData.username); // Set the username from API response
      } else {
        console.error('No user data found'); // Log an error if the array is empty
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleLockClick = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const postCardImage = async () => {
    try {
      const response = await axios.get(`http://172.10.7.117/api/postcard-image/${user.userId}`); // 이미지 API 엔드포인트로 요청
      if (response.data && response.data.imageUrl) {
        setPostcardImage(response.data.imageUrl); // 이미지 URL을 상태에 저장
        console.log(postcardImage)
      } else {
        console.error('Invalid image response:', response);
      }
    } catch (error) {
      console.error('Error fetching postcard image:', error);
    }
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
      <div className={`postcard-container2 ${!isLoggedIn ? 'hidden' : ''}`}>
        <img
          src="/postcard2.jpg" // 기본 포스트카드 이미지
          alt="Postcard"
          className="postcard-image2"
        />
        {postcardImage && (
          <img
            src={postcardImage} // 서버에서 받아온 이미지
            alt="Overlay Postcard"
            className="overlay-image"
          />
        )}
        <div className="postcard-text-container">
          <p className="postcard-text">{username ? `${username}` : 'Loading...'}</p>
        </div>
      </div>
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
        {!isLoggedIn ? (
          <CoverPage /> // Display CoverPage when user is not logged in
        ) : (
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
        )}
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
