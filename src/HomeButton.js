// HomeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeButton.css'; // You can style the button in this CSS file

const HomeButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <button className="home-button" onClick={handleClick}>
      Plot Diary
    </button>
  );
};

export default HomeButton;
