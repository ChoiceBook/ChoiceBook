import React, { useEffect, useState } from 'react';
import './RankList.css'; // 스타일링을 위한 CSS 파일

const RankList = ({ ranks }) => {
  const [rankGroups, setRankGroups] = useState([]);

  useEffect(() => {
    const chunkAndSortRanks = (ranks) => {
      const chunks = [];
      const seenItems = new Set();
      let chunk = [];

      for (let i = 0; i < ranks.length; i++) {
        const itemId = ranks[i].item_id;
        
        if (seenItems.has(itemId)) {
          chunk.sort((a, b) => a.rank_value - b.rank_value);
          chunks.push(chunk);
          chunk = [];
          seenItems.clear();
        }

        seenItems.add(itemId);
        chunk.push(ranks[i]);
      }

      if (chunk.length > 0) {
        chunk.sort((a, b) => a.rank_value - b.rank_value);
        chunks.push(chunk);
      }

      return chunks;
    };

    const sortedChunks = chunkAndSortRanks(ranks);
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
