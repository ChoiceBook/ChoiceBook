// PopupPage.js
import React from 'react';
import './PopupPage.css'; // Import the stylesheet for PopupPage

const PopupPage = ({ isOpen, onClose, ranks }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rank List</h2>
        <ul>
          {ranks.map((rank, index) => (
            <li key={index}>{rank}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupPage;
