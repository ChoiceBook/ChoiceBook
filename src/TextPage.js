import React from 'react';
import './TextPage.css';

const TextPage = React.forwardRef((props, ref) => {
  const { isCoverPage, isFirstPage, isLastPage, title, content, chapterPage, backgroundColor } = props;

  // Conditional class names based on props
  const pageClassName = `flipbook-page ${isCoverPage ? 'cover-page' : ''} ${isFirstPage ? 'first-page' : ''} ${isLastPage ? 'last-page' : ''} ${chapterPage ? 'chapter-page' : ''}`;

  const pageStyle = {
    backgroundColor: backgroundColor || 'white' // Default to white if no background color is provided
  };

  return (
    <div className={pageClassName} ref={ref} style={pageStyle}>
      {isCoverPage ? (
        <div className={`cover-page-content ${isFirstPage ? 'front-cover' : 'back-cover'}`}>
          {isFirstPage && <h1 dangerouslySetInnerHTML={{ __html: title }} />}
          </div>
      ) : (
        <div className="page-content">
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
          <div className="page-body">
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

export default TextPage;
