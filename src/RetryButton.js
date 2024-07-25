import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RetryButton.css'; // You can style the button in this CSS file

const RetryButton = ({ plotId }) => { // Destructure plotId from props
  const navigate = useNavigate();

  const handleClick = () => {   
    console.log(plotId); // Directly use plotId
    navigate(`/plots/${plotId}`); // Navigate to the specific plot page
  };

  return (
    <button className="retry-button" onClick={handleClick}>
      다시하기
    </button>
  );
};

export default RetryButton;
