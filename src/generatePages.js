// generatePages.js
import React from 'react';
import { fetchPlots, fetchRanks, fetchItemDetails } from './api';
import TextPage from './TextPage';

export const generatePages = async () => {
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
    <TextPage key="front-cover" isCoverPage={true} isFirstPage={true} title="Memorial Diary" />
  );

  for (const category of categories) {
    const plots = await fetchPlots(category.id);

    generatedPages.push(
      <TextPage
        key={`chapter-${category.id}`}
        title={category.name}
        content={<div />}
        chapterPage={true}
        isCoverPage={false}
        isFirstPage={false}
        isLastPage={false}
      />
    );

    const plotDataPromises = plots.map(async (plot) => {
      const ranks = await fetchRanks(plot.plot_id, 1);

      const itemsPromises = ranks.map(async (rank) => {
        const itemDetails = await fetchItemDetails(rank.item_id);
        return { ...itemDetails[0], rank_value: rank.rank_value };
      });

      const items = await Promise.all(itemsPromises);
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
                  <div className="item-info">
                    <h2>{item.rank_value}.</h2>
                    <p>{item.item_name}</p>
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

  generatedPages.push(
    <TextPage key="back-cover" isCoverPage={true} isLastPage={true} />
  );

  return generatedPages;
};
