import React from 'react';
import './CoverPage.css'; // You can style the cover page here

const CoverPage = ({ isLoggedIn }) => {
    const coverPageClass = `cover-page ${
        isLoggedIn ? 'cover-page--full-width cover-page--no-line' : 'cover-page--half-width cover-page--with-line'
      }`;
    
  return (
    <div className={coverPageClass}>
      <h1>Memorial<br />Diary</h1>
    </div>
  );
};

export default CoverPage;
