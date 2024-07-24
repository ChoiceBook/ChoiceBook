// generatePlotPages.js
import React from 'react';
import { fetchRanks, fetchItemDetails } from './api';
import TextPage from './TextPage';

export const generatePlotPages = async (plots, userId) => {
  const plotPages = [];

  const plotDataPromises = plots.map(async (plot) => {
    const ranks = await fetchRanks(plot.plot_id, userId);

    const itemsPromises = ranks.map(async (rank) => {
      const itemDetails = await fetchItemDetails(rank.item_id);
      return { ...itemDetails[0], rank_value: rank.rank_value, increasement: rank.increasement };
    });

    const items = await Promise.all(itemsPromises);

    return {
      title: plot.title,
      items: items.sort((a, b) => a.rank_value - b.rank_value),
    };
  });

  const plotData = await Promise.all(plotDataPromises);

  plotData.forEach((data, index) => {
    plotPages.push(
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
                          ? <span style={{ color: 'red', marginLeft: '0.5vw' }}>&#9660; {item.increasement}</span>
                          : <span style={{ color: 'blue', marginLeft: '0.5vw' }}>&#9650; {-item.increasement}</span>
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

  return plotPages;
};
