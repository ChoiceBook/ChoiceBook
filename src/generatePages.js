// generatePages.js
import React from 'react';
import { fetchPlots, fetchRanks, fetchItemDetails, fetchUserPlots } from './api';
import TextPage from './TextPage';
import { FaTrash } from 'react-icons/fa'; // Importing trash can icon

export const generatePages = async (userId) => {
  const generatedPages = [];

  const categories = [
    { id: 1, name: '드라마' },
    { id: 2, name: '영화' },
    { id: 3, name: '게임' },
    { id: 4, name: '애니메이션' },
    { id: 5, name: '음악' },
    { id: 6, name: '음식' },
    { id: 7, name: '스포츠' },
    { id: 8, name: '기타' }
  ];

  generatedPages.push(
    <TextPage key="front-cover" isCoverPage={true} isFirstPage={true} title="Memorial<br />Diary" backgroundColor="#A80839"/>
  );

  // Add a blank page after the front cover
  generatedPages.push(
    <TextPage key="blank-front" isCoverPage={false} isFirstPage={false} isLastPage={false} title="" backgroundColor="#A80839"/>
  );

  for (const category of categories) {
    const plots = await fetchPlots(category.id, userId);

    generatedPages.push(
      <TextPage
        key={`chapter-${category.id}`}
        title={category.name}
        content={<div />}
        chapterPage={true}
        isCoverPage={false}
        isFirstPage={false}
        isLastPage={false}
        backgroundColor="#d7d393"
      />
    );

    const plotDataPromises = plots.map(async (plot) => {
      const ranks = await fetchRanks(plot.plot_id, userId);
      console.log(ranks);

      const itemsPromises = ranks.map(async (rank) => {
        const itemDetails = await fetchItemDetails(rank.item_id);
        return { ...itemDetails[0], rank_value: rank.rank_value, increasement: rank.increasement }; // Include increasement here
      });

      const items = await Promise.all(itemsPromises);
      console.log(items);

      return {
        title: plot.title,
        items: items.sort((a, b) => a.rank_value - b.rank_value),
      };
    });

    const plotData = await Promise.all(plotDataPromises);

    plotData.forEach((data, index) => {
      generatedPages.push(
        <TextPage
          key={`plot-${index}`}
          title={data.title}
          content={
            <div>
              {data.items.map(item => (
                <div key={item.item_id} className="item-row">
                  <div className="item-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h2>{item.rank_value}.</h2>
                      <p style={{ marginLeft: '1vw' }}>{item.item_name}</p>
                    </div>
                    <p style={{ display: 'flex', alignItems: 'center', marginLeft: '12vw' }}>
                      {item.increasement !== null
                        ? item.increasement === 0
                          ? '-'
                          : item.increasement > 0
                            ? <span style={{ color: 'red', marginLeft: '0.5vw' }}>&#9660; {item.increasement}</span> // Red downward triangle
                            : <span style={{ color: 'blue', marginLeft: '0.5vw' }}>&#9650; {-item.increasement}</span> // Blue upward triangle
                        : 'NEW'}
                    </p>
                  </div>
                  <div className="item-image-container">
                    <img src={item.item_image_url} alt={item.item_name} className="item-image" />
                  </div>
                </div>
              ))}
            </div>
          }
        />
      );
    });
    
    
  }
// Add chapter for "내가 만든 플롯"
generatedPages.push(
  <TextPage
    key="user-plots-chapter"
    title="내가 만든 플롯"
    content={<div />}
    chapterPage={true}
    isCoverPage={false}
    isFirstPage={false}
    isLastPage={false}
    backgroundColor="#d7d393"
  />
);

// Fetch user plots for the list page
const userPlots = await fetchUserPlots(userId);

// Add a separate page with a list of all user plots
generatedPages.push(
  <TextPage
    key="user-plots-list"
    title="내가 만든 플롯"
    content={
      <div style={{ paddingLeft: '1.5vw', paddingRight: '1.5vw', paddingTop: '1vw', paddingBottom: '1vw', display: 'flex', flexDirection: 'column' }}>
        {userPlots.map((plot) => (
      <div key={plot.plot_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.7em' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '1.3em',
              flex: '100%', // Allows the title to take up available space
              minWidth: '85%', // Ensures that title column does not shrink smaller than its content
            }}>
              {plot.title}
            </p>
            <button
              onClick={() => handleDeletePlot(plot.plot_id)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#ccc',
                fontSize: '1.3em',
                marginLeft: '1em', // Pushes the button to the right end
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    }
    chapterPage={false}
    isCoverPage={false}
    isFirstPage={false}
    isLastPage={false}
    backgroundColor="#ffffff"
  />
);

  // Add a blank page if the total number of pages is even
  if (generatedPages.length % 2 === 1) {
    generatedPages.push(
      <TextPage key="extra-page" isCoverPage={false} isFirstPage={false} isLastPage={false} title="" />
    );
  }

  // Add a blank page before the back cover
  generatedPages.push(
    <TextPage key="blank-back" isCoverPage={false} isFirstPage={false} isLastPage={false} title="" backgroundColor="#A80839"/>
  );

  generatedPages.push(
    <TextPage key="back-cover" isCoverPage={true} isLastPage={true} backgroundColor="#A80839"/>
  );

  return generatedPages;
};

// Function to handle plot deletion
const handleDeletePlot = async (plotId) => {
  try {
    const response = await fetch(`http://172.10.7.117/api/plots/${plotId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete plot');
    }

    alert('Plot deleted successfully');
    // Refresh the page or handle post-deletion actions
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to delete plot');
  }
};