// generatePages.js
import React from 'react';
import { fetchPlots, fetchUserPlots } from './api';
import TextPage from './TextPage';
import { generatePlotPages } from './generatePlotPages';
import { FaTrash } from 'react-icons/fa';

const handleDeletePlot = async (userId, plotId, navigate) => {
  navigate(`/users/${userId}/plots/${plotId}/delete`);
};

export const generatePages = async (userId, navigate) => {
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

    const plotPages = await generatePlotPages(plots, userId);
    generatedPages.push(...plotPages);
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
                onClick={() => handleDeletePlot(userId, plot.plot_id, navigate)}
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
