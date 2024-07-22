import React from 'react';
import './TextPage.css';

const TextPage = React.forwardRef((props, ref) => {
  const { isCoverPage, isFirstPage, isLastPage, title, content, chapterPage } = props;

  // Conditional class names based on props
  const pageClassName = `flipbook-page ${isCoverPage ? 'cover-page' : ''} ${isFirstPage ? 'first-page' : ''} ${isLastPage ? 'last-page' : ''} ${chapterPage ? 'chapter-page' : ''}`;

  return (
    <div className={pageClassName} ref={ref}>
      {isCoverPage ? (
        <div className={`cover-page-content ${isFirstPage ? 'front-cover' : 'back-cover'}`}>
          {isFirstPage && <h1>{title}</h1>}
        </div>
      ) : (
        <div className="page-content">
          <h1>{title}</h1>
          <div className="page-body">
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

export default TextPage;
