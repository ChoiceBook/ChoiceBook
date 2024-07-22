import React, { useState, useEffect } from 'react';
import PopupPage from './PopupPage'; // Import the PopupPage component
import './Flipbook.css'; // Import the stylesheet for TextPage

const TextPage = React.forwardRef((props, ref) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState('rankings'); // 'rankings' or 'textBoxes'
  const [popupContent, setPopupContent] = useState(''); // Content for the popup
  const [rankings, setRankings] = useState([]); // Rankings data
  const [plotTitle, setPlotTitle] = useState(''); // Plot title
  const [items, setItems] = useState([]); // Items data
  const plotId = props.plotId; // Get plotId from props

  useEffect(() => {
    // Fetch plot data and associated ranks and items
    const fetchData = async () => {
      try {
        const plotResponse = await fetch(`https://a8ad-2001-2d8-6318-bc5f-11bb-772b-f4e0-db89.ngrok-free.app/api/users/1/categories/${props.categoryId}/plots`);
        const plots = await plotResponse.json();
        const plot = plots.find(p => p.plot_id === plotId);
        setPlotTitle(plot ? plot.title : 'Unknown Plot');

        // Fetch ranks for the plot
        const ranksResponse = await fetch(`https://a8ad-2001-2d8-6318-bc5f-11bb-772b-f4e0-db89.ngrok-free.app/api/plots/${plotId}/users/1/ranks`);
        const ranks = await ranksResponse.json();
        const sortedRanks = ranks.sort((a, b) => a.rank_value - b.rank_value);

        setRankings(sortedRanks);

        // Fetch items based on rank IDs
        const itemPromises = sortedRanks.map(rank => fetch(`https://a8ad-2001-2d8-6318-bc5f-11bb-772b-f4e0-db89.ngrok-free.app/api/items/${rank.item_id}`));
        const itemsResponses = await Promise.all(itemPromises);
        const itemsData = await Promise.all(itemsResponses.map(res => res.json()));
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [plotId, props.categoryId]);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from affecting the flipbook
  };

  const handleTextBoxClick = (content) => {
    return (e) => {
      e.stopPropagation();
      setPopupContent(content);
      setIsPopupOpen(true);
    };
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div
      className={`flipbook-page ${props.isCoverPage ? 'cover-page' : ''} ${props.isFirstPage ? 'first-page' : ''} ${props.isLastPage ? 'last-page' : ''}`}
      ref={ref}
      data-density={props.soft ? "soft" : "hard"}
      onClick={handleClick}
    >
      {props.isCoverPage ? (
        <div className="cover-page-content">
          <h1>{props.title}</h1>
        </div>
      ) : (
        <>
          <div className="header">
            <h2 className="title">{plotTitle}</h2>
          </div>
          {viewMode === 'rankings' ? (
            <ul className="rankings-list">
              {rankings.map((rank, index) => {
                const item = items.find(i => i.item_id === rank.item_id);
                return item ? (
                  <li key={rank.rank_id}>
                    <img src={item.item_image_url} alt={item.item_name} style={{ width: '50px', height: '50px' }} />
                    {rank.rank_value}. {item.item_name}
                  </li>
                ) : null;
              })}
            </ul>
          ) : (
            <div className="text-boxes">
              <div className="text-box" onClick={handleTextBoxClick('Text Box 1 Content')}>Text Box 1</div>
              <div className="text-box" onClick={handleTextBoxClick('Text Box 2 Content')}>Text Box 2</div>
              <div className="text-box" onClick={handleTextBoxClick('Text Box 3 Content')}>Text Box 3</div>
            </div>
          )}
          <PopupPage isOpen={isPopupOpen} onClose={closePopup} content={popupContent} />
        </>
      )}
    </div>
  );
});

export default TextPage;
