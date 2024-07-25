import React, { useEffect, useState } from 'react';
import './RankList.css'; // Assuming you have a CSS file for styling

const RankList = ({ ranks }) => {
  const [rankGroups, setRankGroups] = useState([]);

  useEffect(() => {
    const chunkAndSortRanks = (ranks, chunkSize) => {
      const chunks = [];
      for (let i = 0; i < ranks.length; i += chunkSize) {
        const chunk = ranks.slice(i, i + chunkSize);
        chunk.sort((a, b) => a.rank_value - b.rank_value);
        chunks.push(chunk);
      }
      return chunks;
    };

    const sortedChunks = chunkAndSortRanks(ranks, 5);
    setRankGroups(sortedChunks);
  }, [ranks]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  return (
    <div className="rank-list-container">
      {rankGroups.map((group, index) => (
        <div key={index} className="ranking-list-container2">
          <div className="ranking-title">순위</div>
          <ol className="ranking-list">
            {group.map((rank) => (
              <li key={rank.rank_id} className="rank-item">
                {rank.item_name}
              </li>
            ))}
          </ol>
          <div className="ranked-at">{formatDate(group[0]?.ranked_at)}</div> 
        </div>
      ))}
    </div>
  );
};

export default RankList;
