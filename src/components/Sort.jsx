import React, { useState, useEffect } from 'react';

export const Sort = ({ items }) => {
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

  useEffect(() => {
    initList();
  }, [items]); // items가 변경될 때마다 초기화

  const initList = () => {
    const names = items.map(item => item.item_name);
    setNamMember(names);
    
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

    // Remaining elements processing
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

    // Updating the parent list
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

      // Reset rec array
      if (head1Temp === 0 && head2Temp === 0) {
        recTemp.fill(0);
        nrecTemp = 0;
      }
    }

    if (cmp1Temp < 0) {
      console.log("Comparison finished."); // 디버깅을 위한 콘솔 로그 추가
      setFinishFlag(1);  // 추가된 부분: 비교가 끝났음을 표시
      showResult();  // 추가된 부분: 결과를 표시하는 함수 호출
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
    document.getElementById("resultField").innerHTML = str;
  };



  const showImage = (head1Temp, head2Temp) => {
    if (lstMember[cmp1] && lstMember[cmp2] && head1Temp < lstMember[cmp1].length && head2Temp < lstMember[cmp2].length) {
      document.getElementById("leftField").innerText = namMember[lstMember[cmp1][head1Temp]];
      document.getElementById("rightField").innerText = namMember[lstMember[cmp2][head2Temp]];
      document.getElementById("battleNumber").innerHTML = "Battle No." + numQuestion + "<br>" + Math.floor(finishSize * 100 / totalSize) + "% sorted.";
    }
  };

  useEffect(() => {
    if (cmp1 !== null && cmp2 !== null && lstMember[cmp1] && lstMember[cmp2]) {
      showImage(head1, head2);
    }
  }, [cmp1, cmp2, head1, head2, lstMember]);

  return (
    <div style={{ textAlign: "center" }}>
      <table id="mainTable" align="center">
        <tbody>
          <tr>
            <td id="battleNumber" colSpan={3} style={{ paddingBottom: 10 }}>
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td
              id="leftField"
              onClick={() => finishFlag === 0 && sortList(-1)}
              rowSpan={2}
              style={{ border: "1px solid black", width: "120px", height: "150px" }}
            ></td>
            <td
              id="rightField"
              onClick={() => finishFlag === 0 && sortList(1)}
              rowSpan={2}
              style={{ border: "1px solid black", width: "120px", height: "150px" }}
            ></td>
          </tr>
        </tbody>
      </table>
      <div id="resultField" style={{ textAlign: "center" }}></div>
    </div>
  );
};

export default Sort;
