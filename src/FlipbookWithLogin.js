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
import HomeButton from './HomeButton'; // Import the HomeButton component

const FlipbookWithLogin = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(''); // State to store username
  const flipbookRef = useRef(null);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [pageIndices, setPageIndices] = useState({});
  const [postcardImage, setPostcardImage] = useState('');

  useEffect(() => {
    if (loading) return; // Wait until user data is loaded
  
    const loggedIn = !!user;
  
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      fetchAndSetUsername(user.userId); // Fetch username when logged in
      postCardImage(); // 이미지 로드 함수 호출
    }
  
    const loadData = async () => {
      if (!user) return; // Wait for user data to be available
  
      try {
        if (loggedIn) {
          const generatedPages = await generatePages(user.userId, navigate);
          setPages(generatedPages.map((page, index) => (
            <div key={index}>
              {page}
            </div>
          )));

        // Create page indices for chapter navigation
        const chapterNames = ["드라마", "영화", "게임", "애니메이션", "음악", "음식", "스포츠", "기타", "내가 만든 플롯"];
        const indices = {};

// Iterate through pages to assign indices
        generatedPages.forEach((page, index) => {
          if (page.props.title && chapterNames.includes(page.props.title)) {
    // Only add the index if it doesn't already exist
            if (!(page.props.title in indices)) {
              indices[page.props.title] = index;
              console.log('Chapter title:', page.props.title); // Debugging log
            }
          }
          console.log('Title:', page.props.title);
        });

        console.log('Indices:', indices); // Debugging log
        setPageIndices(indices);

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


  const postCardImage = async () => {
    try {
      console.log("postcard: ", `http://172.10.7.117/api/postcard-image/${user.userId}`)
      const response = await axios.get(`http://172.10.7.117/api/postcard-image/${user.userId}`); // 이미지 API 엔드포인트로 요청
      if (response.data && response.data.imageUrl) {
        setPostcardImage(response.data.imageUrl); // 이미지 URL을 상태에 저장
        console.log("postcard: ", response)
      } else {
        setPostcardImage('');
        console.error('Invalid image response:', response);
      }
    } catch (error) {
      setPostcardImage('');
      console.error('Error fetching postcard image:', error);
    }
  };

  const handleLogout = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().turnToPage(0);
    }
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginVisible(false);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleBackToLoginClick = () => {
    setIsRegistering(false);
  };

  const handleSearchClick = () => {
    if (isLoggedIn)
      navigate('/search');
  };

  const handlePenClick = () => {
    if (isLoggedIn)
      navigate('/create-test');
  };

  const handleTicketClick = (category) => {
    if (flipbookRef.current && pageIndices[category.toLowerCase()]) {
      flipbookRef.current.pageFlip().turnToPage(pageIndices[category.toLowerCase()]);
    }
    console.log('category:', category); // Debugging log
  };

  return (
    <div className="flipbook-wrapper">
      <HomeButton />
      <div className={`postcard-container2 ${!isLoggedIn ? 'hidden' : 'visible'}`}>
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
      <div className={`login-section ${isLoggedIn ? 'hidden' : 'visible'}`}>
        {isRegistering ? (
          <Register onBackToLoginClick={handleBackToLoginClick} />
        ) : (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setIsLoginVisible={setIsLoginVisible} 
            onLoginSuccess={handleLoginSuccess} 
            onRegisterClick={handleRegisterClick} 
          />
        )}
      </div>
      <div className={`flipbook-container ${!isLoggedIn ? 'locked' : ''}`}>
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
        <>
          <button className="logout-image-button" onClick={handleLogout}>
  <img src="/x.png" alt="Logout" />
</button>

          <div className="tickets-container">
          <button className="ticket-button ticket-drama" onClick={() => handleTicketClick('드라마')}>
            <img src="/drama.png" alt="드라마" />
          </button>
          <button className="ticket-button ticket-movie" onClick={() => handleTicketClick('영화')}>
            <img src="/movie.png" alt="영화" />
          </button>
          <button className="ticket-button ticket-game" onClick={() => handleTicketClick('게임')}>
            <img src="/game.png" alt="게임" />
          </button>
          <button className="ticket-button ticket-animation" onClick={() => handleTicketClick('애니메이션')}>
            <img src="/animation.png" alt="애니메이션" />
          </button>
          <button className="ticket-button ticket-music" onClick={() => handleTicketClick('음악')}>
            <img src="/music.png" alt="음악" />
          </button>
          <button className="ticket-button ticket-food" onClick={() => handleTicketClick('음식')}>
            <img src="/food.png" alt="음식" />
          </button>
          <button className="ticket-button ticket-sports" onClick={() => handleTicketClick('스포츠')}>
            <img src="/sports.png" alt="스포츠" />
          </button>
          <button className="ticket-button ticket-etc" onClick={() => handleTicketClick('기타')}>
            <img src="/etc.png" alt="기타" />
          </button>
          <button className="ticket-button ticket-myplots" onClick={() => handleTicketClick('내가 만든 플롯')}>
            <img src="/myplots.png" alt="내가 만든 플롯" />
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default FlipbookWithLogin;
