import React from 'react';


export const Rank = () => {
    const rankingList = [];
    const member = ['해린', '하니']

    for (let i = 0; i < member.length; i++) {
        rankingList.push(
            <li key={i}>{member[i]}</li>
        );
    }
    return (
        <div className="ranking-list-container">
            <div className="ranking-title">순위</div>
            <ol className="ranking-list">
                {rankingList}
            </ol>
        </div>
    );
};
