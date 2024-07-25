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
      plotId: plot.plot_id, // plot_id 추가
      title: plot.title,
      items: items.sort((a, b) => a.rank_value - b.rank_value),
    };
  });

  const plotData = await Promise.all(plotDataPromises);

  plotData.forEach((data, index) => {
    plotPages.push(
      <TextPage
        key={`plot-${index}`}
        plotId={data.plotId} // plot_id 넘기기
        title={data.title}
        content={
          <div>
            {data.items.map(item => (
              <div key={item.item_id} className="item-row">
                <div className="item-info">
                  <div className="item-rank-name" style={{ marginLeft: '2vw' }}> 
                    <h2 className="item-rank" style={{ marginRight: '0.5vw' }}>{item.rank_value}.</h2>
                    <div className="item-name" style={{ flexGrow: 1 }}>
                      <p>{item.item_name}</p>
                    </div>
                  </div>
                  <div className="item-increasement" style={{ marginRight: '1vw' }}>
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                      {item.increasement !== null
                        ? item.increasement === 0
                          ? '-'
                          : item.increasement > 0
                            ? <span style={{ color: 'red', marginLeft: '0.5vw' }}>&#9660; {item.increasement}</span>
                            : <span style={{ color: 'blue', marginLeft: '0.5vw' }}>&#9650; {-item.increasement}</span>
                        : 'NEW'}
                    </p>
                  </div>
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
