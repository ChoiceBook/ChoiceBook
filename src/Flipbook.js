// src/Flipbook.js
import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Flipbook.css'; // Import the stylesheet

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="flipbook-page" ref={ref} data-density={props.soft ? "soft" : "hard"}>
      <h2>Page {props.number}</h2>
      <p>{props.children}</p>
      <a href={`#page${props.number % 4 + 1}`} className="page-link">Go to Page {props.number % 4 + 1}</a>
    </div>
  );
});

const Flipbook = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const flipbookRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flipbook-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <span className="sidebar-close-btn" onClick={toggleSidebar}>
            &times;
          </span>
          <h2>Login</h2>
          <form>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {/* Toggle button for sidebar */}
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>

      {/* Flipbook container */}
      <div className="flipbook-container">
        <HTMLFlipBook
          width={600} // Adjust width as needed
          height={600} // Adjust height as needed
          size="stretch"
          minWidth={315}
          maxWidth={700}
          minHeight={420}
          maxHeight={1350}
          drawShadow={true}
          flippingTime={700} // Adjust flipping time for softer effect
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          swipeDistance={30}
          clickEventForward={true}
          useMouseEvents={true}
          renderOnlyPageLengthChange={false}
          ref={flipbookRef}
        >
          <Page number={1} soft={true}>This is the content of Page 1.</Page>
          <Page number={2} soft={true}>This is the content of Page 2.</Page>
          <Page number={3} soft={true}>This is the content of Page 3.</Page>
          <Page number={4} soft={true}>This is the content of Page 4.</Page>
          <Page number={5} soft={true}>This is the content of Page 5.</Page>
          <Page number={6} soft={true}>This is the content of Page 6.</Page>
          <Page number={7} soft={true}>This is the content of Page 7.</Page>
          <Page number={8} soft={true}>This is the content of Page 8.</Page>
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default Flipbook;
