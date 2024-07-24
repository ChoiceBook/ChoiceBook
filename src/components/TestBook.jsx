import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './TestBook.css'; // Import the CSS for the flipbook
import { useAuth } from '../AuthContext';

const TestBook = ({ items, plotId }) => {
    const { user, loading } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
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
    const [resultField, setResultField] = useState(''); // Initialize state for resultField
    const [leftField, setLeftField] = useState('');
    const [rightField, setRightField] = useState('');
    const [battleNumber, setBattleNumber] = useState('');
    const [imgUrls, setImgUrls] = useState({}); 
    const [imgIds, setImgIds] = useState({});

    useEffect(() => {
        initList();
    }, [items, plotId]); // Initialize when items change

    const initList = () => {
      const validItemIds = items.map(item => item.item_id).filter(id => id >= 0);
      //const maxItemId = Math.max(...validItemIds, 0); // Default to 0 if no valid item_ids
  
      const names = items.map(item => item.item_name);
      const urls = items.map(item => item.item_image_url);
      const ids = items.map(item => item.item_id);

      console.log("Initialized Image URLs:", urls); // Log to check initialization


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
        let str = "<table style='width:200px; font-size:12px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse' align='center'>";
        str += "<tr><td style='color:#ffffff; background-color:#000; text-align:center;'>순위</td><td style='color:#ffffff; background-color:#000; text-align:center;'>이름</td></tr>";
        for (let i = 0; i < namMember.length; i++) {
            str += "<tr><td style='border:1px solid #000; text-align:right; padding-right:5px;'>" + ranking + "</td><td style='border:1px solid #000; padding-left:5px;'>" + namMember[lstMember[0][i]] + "</td></tr>";
            if (i < namMember.length - 1) {
                if (equal[lstMember[0][i]] === lstMember[0][i + 1]) {
                    sameRank++;
                } else {
                    ranking += sameRank;
                    sameRank = 1;
                }
            }
        }
        str += "</table>";
        setResultField(str); // Use state to manage HTML content
        saveResultsToDB();

    };

    const saveResultsToDB = async () => {
        for (let i = 0; i < namMember.length; i++) {
            const rankData = {
                user_id: user.userId,
                plot_id: plotId,
                item_id: imgIds[lstMember[0][i]],
                rank_value: i + 1
            };
            console.log("Save results: ", rankData)
        }
    };

    const showImage = (head1Temp, head2Temp) => {
      if (lstMember[cmp1] && lstMember[cmp2] && head1Temp < lstMember[cmp1].length && head2Temp < lstMember[cmp2].length) {
          //const leftImageUrl = imgUrls[lstMember[cmp1][head1Temp]];
          //const rightImageUrl = imgUrls[lstMember[cmp2][head2Temp]];

          const leftItemId = lstMember[cmp1][head1Temp];
          const rightItemId = lstMember[cmp2][head2Temp];

          console.log("Left Item ID:", leftItemId);
          console.log("Right Item ID:", rightItemId);
          console.log("Image URLs Array:", imgUrls); // Check if image URLs are present

          const leftImageUrl = imgUrls[leftItemId];
          const rightImageUrl = imgUrls[rightItemId];
    
          console.log("Left Image URL:", leftImageUrl);  // Log the URL for debugging
          console.log("Right Image URL:", rightImageUrl); // Log the URL for debugging

          setLeftField(
            <div className="item-container">
              <p className="item-text">{namMember[leftItemId]}</p>
            <img 
                src={leftImageUrl} 
                alt={namMember[leftItemId]} 
                className="item-image-box"
            />
        </div>
          );
    
          setRightField(
            <div className="item-container">
                <p className="item-text">{namMember[rightItemId]}</p>
                <img 
                    src={rightImageUrl} 
                    alt={namMember[rightItemId]} 
                    className="item-image-box" 
                />
            </div>
        );
        setBattleNumber(`Battle No. ${numQuestion}<br>${Math.floor(finishSize * 100 / totalSize)}% sorted.`);
      }
    };
    

useEffect(() => {
  console.log("Image URLs:", imgUrls); // Log to check URL mapping

    if (cmp1 !== null && cmp2 !== null && lstMember[cmp1] && lstMember[cmp2]) {
        showImage(head1, head2);
    }
}, [cmp1, cmp2, head1, head2, lstMember, imgUrls]);

    const handleChoice = (choice) => {
        if (finishFlag) return;
        sortList(choice);
        setFlipped(true);
        setTimeout(() => {
            setFlipped(false);
            setCurrentIndex(prevIndex => prevIndex + 1); // Move to next page
        }, 1000); // Adjust the delay according to the flip effect duration
    };

    return (
        <div className="testbook-container">
            <HTMLFlipBook width={300} height={500} className="testbook">
            <div className="testbook-page">
                    <div className="testbook-content" onClick={() => handleChoice(-1)}>
                        {leftField}
                    </div>
                </div>
                <div className="testbook-page">
                    <div className="testbook-content" onClick={() => handleChoice(1)}>
                        {rightField}
                    </div>
                </div>
            </HTMLFlipBook>
            <div
                id="resultField"
                className="result-field"
                dangerouslySetInnerHTML={{ __html: resultField }}
            />
            <div
                id="battleNumber"
                className="battle-number"
                dangerouslySetInnerHTML={{ __html: battleNumber }}
            />
        </div>
    );
};

export default TestBook;

