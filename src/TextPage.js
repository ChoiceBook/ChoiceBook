// TextPage.js
import React, { useState } from 'react';
import PopupPage from './PopupPage'; // Import the PopupPage component
import './Flipbook.css'; // Import the stylesheet for TextPage

const TextPage = React.forwardRef((props, ref) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClick = (e) => {
    // Prevent click from affecting the flipbook
    e.stopPropagation();
  };

  const handleTextBoxClick = (e) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const ranks = [
    "Rank 1: John Doe",
    "Rank 2: Jane Smith",
    "Rank 3: Emily Johnson",
    // Add more ranks as needed
  ];

  return (
    <div className="flipbook-page" ref={ref} data-density={props.soft ? "soft" : "hard"} onClick={handleClick}>
      <div className="text-box" onClick={handleTextBoxClick}>Text Box 1</div>
      <div className="text-box" onClick={handleTextBoxClick}>Text Box 2</div>
      <div className="text-box" onClick={handleTextBoxClick}>Text Box 3</div>
      <PopupPage isOpen={isPopupOpen} onClose={closePopup} ranks={ranks} />
    </div>
  );
});

export default TextPage;
