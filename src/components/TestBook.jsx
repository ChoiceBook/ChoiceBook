import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestBook.css';
import { useAuth } from '../AuthContext';

const TestBook = ({ items, plotId }) => {
    const { user, loading } = useAuth();
    const [namMember, setNamMember] = useState([]);
    const [lstMember, setLstMember] = useState([]);
    const [parent, setParent] = useState([]);
    const [equal, setEqual] = useState([]);
    const [rec, setRec] = useState([]);
    const [cmp1, setCmp1] = useState(null);
    const [cmp2, setCmp2] = useState(null);
    const [head1, setHead1] = useState(0);
    const [head2, setHead2] = useState(0);
    const [nrec, setNrec] = useState(0);
    const [numQuestion, setNumQuestion] = useState(1);
    const [totalSize, setTotalSize] = useState(0);
    const [finishSize, setFinishSize] = useState(0);
    const [finishFlag, setFinishFlag] = useState(0);
    const [resultField, setResultField] = useState('');
    const [leftItem, setLeftItem] = useState(null);
    const [rightItem, setRightItem] = useState(null);
    const [battleNumber, setBattleNumber] = useState('');
    const [imgUrls, setImgUrls] = useState({});
    const [imgIds, setImgIds] = useState({});
    const [topRankedItem, setTopRankedItem] = useState(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        initList();
    }, [items, plotId]);


    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const initList = () => {
      const shuffledItems = shuffleArray([...items]);
  
      const names = shuffledItems.map(item => item.item_name);
      const urls = shuffledItems.map(item => item.item_image_url);
      const ids = shuffledItems.map(item => item.item_id);

      console.log("Initialized Image URLs:", urls); // Log to check initialization

        const names = items.map(item => item.item_name);
        const urls = items.map(item => item.item_image_url);
        const ids = items.map(item => item.item_id);

        setNamMember(names);
        setImgUrls(urls);
        setImgIds(ids);

        let n = 0;
        let mid;
        let i;

        const lstMemberTemp = [];
        const parentTemp = [];
        const equalTemp = Array(names.length + 1).fill(-1);

        lstMemberTemp[n] = [];
        for (i = 0; i < names.length; i++) {
            lstMemberTemp[n][i] = i;
        }
        parentTemp[n] = -1;
        let totalSizeTemp = 0;
        n++;

        for (i = 0; i < lstMemberTemp.length; i++) {
            if (lstMemberTemp[i].length >= 2) {
                mid = Math.ceil(lstMemberTemp[i].length / 2);
                lstMemberTemp[n] = lstMemberTemp[i].slice(0, mid);
                totalSizeTemp += lstMemberTemp[n].length;
                parentTemp[n] = i;
                n++;
                lstMemberTemp[n] = lstMemberTemp[i].slice(mid);
                totalSizeTemp += lstMemberTemp[n].length;
                parentTemp[n] = i;
                n++;
            }
        }

        setLstMember(lstMemberTemp);
        setParent(parentTemp);
        setEqual(equalTemp);
        setRec(Array(names.length).fill(0));
        setCmp1(lstMemberTemp.length - 2);
        setCmp2(lstMemberTemp.length - 1);
        setTotalSize(totalSizeTemp);
    };

    const sortList = (flag) => {
        if (finishFlag) return;

        const recTemp = [...rec];
        let head1Temp = head1;
        let head2Temp = head2;
        let nrecTemp = nrec;
        let finishSizeTemp = finishSize;
        let cmp1Temp = cmp1;
        let cmp2Temp = cmp2;

        if (flag < 0) {
            recTemp[nrecTemp] = lstMember[cmp1Temp][head1Temp];
            head1Temp++;
            nrecTemp++;
            finishSizeTemp++;
            while (equal[recTemp[nrecTemp - 1]] !== -1) {
                recTemp[nrecTemp] = lstMember[cmp1Temp][head1Temp];
                head1Temp++;
                nrecTemp++;
                finishSizeTemp++;
            }
        } else if (flag > 0) {
            recTemp[nrecTemp] = lstMember[cmp2Temp][head2Temp];
            head2Temp++;
            nrecTemp++;
            finishSizeTemp++;
            while (equal[recTemp[nrecTemp - 1]] !== -1) {
                recTemp[nrecTemp] = lstMember[cmp2Temp][head2Temp];
                head2Temp++;
                nrecTemp++;
                finishSizeTemp++;
            }
        }

        if (head1Temp < lstMember[cmp1Temp].length && head2Temp === lstMember[cmp2Temp].length) {
            while (head1Temp < lstMember[cmp1Temp].length) {
                recTemp[nrecTemp] = lstMember[cmp1Temp][head1Temp];
                head1Temp++;
                nrecTemp++;
                finishSizeTemp++;
            }
        } else if (head1Temp === lstMember[cmp1Temp].length && head2Temp < lstMember[cmp2Temp].length) {
            while (head2Temp < lstMember[cmp2Temp].length) {
                recTemp[nrecTemp] = lstMember[cmp2Temp][head2Temp];
                head2Temp++;
                nrecTemp++;
                finishSizeTemp++;
            }
        }

        if (head1Temp === lstMember[cmp1Temp].length && head2Temp === lstMember[cmp2Temp].length) {
            for (let i = 0; i < lstMember[cmp1Temp].length + lstMember[cmp2Temp].length; i++) {
                lstMember[parent[cmp1Temp]][i] = recTemp[i];
            }
            lstMember.pop();
            lstMember.pop();
            cmp1Temp -= 2;
            cmp2Temp -= 2;
            head1Temp = 0;
            head2Temp = 0;

            if (head1Temp === 0 && head2Temp === 0) {
                recTemp.fill(0);
                nrecTemp = 0;
            }
        }

        if (cmp1Temp < 0) {
            console.log("Comparison finished.");
            setFinishFlag(1);
            showResult();
            console.log(lstMember[0]);

        } else {
            setRec(recTemp);
            setHead1(head1Temp);
            setHead2(head2Temp);
            setNrec(nrecTemp);
            setFinishSize(finishSizeTemp);
            setNumQuestion(numQuestion + 1);
            setCmp1(cmp1Temp);
            setCmp2(cmp2Temp);
            showImage(head1Temp, head2Temp);
        }
    };

    const showResult = () => {
        let ranking = 1;
        let sameRank = 1;
    
        // Create a list of items with ranking
        const rankingList = namMember.map((name, index) => {
            const currentItem = lstMember[0][index];
            let itemRank = ranking;
            if (index > 0 && equal[lstMember[0][index - 1]] === lstMember[0][index]) {
                itemRank = ranking - sameRank + 1;
                sameRank++;
            } else {
                ranking += sameRank;
                sameRank = 1;
            }
    
            return (
                <li key={index}>
                    {name}
                </li>
            );
        });
    
        // Set the result field as a styled container with the ranking list
        setResultField(
            <div className="ranking-list-container">
                <div className="ranking-title">순위</div>
                <ol className="ranking-list">
                    {rankingList}
                </ol>
            </div>
        );
    
        // Set the top-ranked item
        const topItem = lstMember[0][0];
        setTopRankedItem({
            id: topItem,
            name: namMember[topItem],
            imageUrl: imgUrls[topItem]
        });
    
        // Show the results
        setShowResults(true);
        saveResultsToDB();
    };    

    const saveResultsToDB = async () => {
        for (let i = 0; i < namMember.length; i++) {
            const rankData = {
                plot_id: plotId,
                user_id: user.userId,
                item_id: imgIds[lstMember[0][i]],
                rank_value: i + 1
            };
            console.log("Save results: ", rankData);
            try {
                const response = await axios.post('http://172.10.7.117/api/ranks', rankData);
                console.log('Rank saved:', response.data);
            } catch (error) {
                console.error('Error saving rank:', error);
            }
        }
        const playData = {
            user_id: user.userId,
            plot_id: plotId
        };

        try {
            const response = await axios.post('http://172.10.7.117/api/userplayedplots', playData);
            console.log('Played plot saved:', response.data);
        } catch (error) {
            console.error('Error saving played plot:', error);
        }
    };

    const showImage = (head1Temp, head2Temp) => {
        if (lstMember[cmp1] && lstMember[cmp2] && head1Temp < lstMember[cmp1].length && head2Temp < lstMember[cmp2].length) {
            const leftItemId = lstMember[cmp1][head1Temp];
            const rightItemId = lstMember[cmp2][head2Temp];

            const leftImageUrl = imgUrls[leftItemId];
            const rightImageUrl = imgUrls[rightItemId];

            setLeftItem({
                id: leftItemId,
                name: namMember[leftItemId],
                imageUrl: leftImageUrl
            });

            setRightItem({
                id: rightItemId,
                name: namMember[rightItemId],
                imageUrl: rightImageUrl
            });

            setBattleNumber(`Battle No. ${numQuestion} - ${Math.floor(finishSize * 100 / totalSize)}% sorted.`);
        }
    };

    useEffect(() => {
        if (cmp1 !== null && cmp2 !== null && lstMember[cmp1] && lstMember[cmp2]) {
            showImage(head1, head2);
        }
    }, [cmp1, cmp2, head1, head2, lstMember, imgUrls]);

    const handleChoice = (choice) => {
        if (finishFlag) return;
        sortList(choice);
    };

    return (
        <div className="testbook-container">
            {!showResults ? (
                <div className="battle-container">
                    {leftItem && (
                        <div className="test-option" onClick={() => handleChoice(-1)}>
                            <img src={leftItem.imageUrl} alt={leftItem.name} className="test-image" />
                            <p className="test-name">{leftItem.name}</p>
                        </div>
                    )}
                    {rightItem && (
                        <div className="test-option" onClick={() => handleChoice(1)}>
                            <img src={rightItem.imageUrl} alt={rightItem.name} className="test-image" />
                            <p className="test-name">{rightItem.name}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="result-container">
                    {topRankedItem && (
                        <div className="top-ranked-item">
                            <img src={topRankedItem.imageUrl} alt={topRankedItem.name} className="test-image" />
                            <p className="test-name">{topRankedItem.name}</p>
                        </div>
                    )}
                    <div className="result-list">
                        {resultField}
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default TestBook;
