# 플롯 다이어리
<br/>
플롯 (plot) 이란,

소설, 영화 등 작품에서 이야기를 구성하는 일련의 사건 또는 사건의 논리적인 패턴과 배치를 의미합니다.

나의 취향, 선호하는 것들을 정리하며 다이어리에 기록하고자 “플롯 다이어리”를 만들었습니다. 소설 속 셜록 홈즈가 사건을 파헤쳐 나아가 듯, 나에 대해 더 깊이 알아가는 시간을 가질 수 있길 바랍니다.

플롯 다이어리에는 8개의 카테고리 (드라마, 영화, 게임, 애니메이션, 음악, 음식, 스포츠, 기타)를 기반으로 나의 취미, 취향을 기록할 수 있습니다.

플롯 다이어리를 통해 나만의 플롯을 만들어 보세요.


## Team
<br/>

**공진우** <a href="https://github.com/wlsdnqqq17"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"></a>

**홍바다** <a href="https://github.com/BadaHong"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"></a>


## Tech Stack
<br/>

**프론트엔드**

- **Framework:** React
- **Language:** Javascript
- **IDE:** VSCode

**백엔드**

- **Cloud:** KCloud
- **Server:** Node.js Express
- **DB:** MySQL
- **IDE:** VSCode, MySQL Workbench


## MySQL DB & API 명세서
<br/>
![db](https://github.com/user-attachments/assets/a7f970ac-efc2-40b2-85f5-3494f9de8ba3)

https://www.notion.so/madcamp/API-3a7e302e689c4056bd410a3271b560f8?pvs=25


## Details
<br/>

### **로그인 페이지는…**

**AccessToken**과 **RefreshToken** 사용으로 자체 로그인을 구현하였습니다. 등록 되어 있는 메일과 비밀번호가 아닐 경우 경고문을 띄우며, 새로운 유저를 위해 회원가입 창도 존재합니다.
<img width="1470" alt="1-1" src="https://github.com/user-attachments/assets/267e9bee-28f5-4d8e-b296-e1f7601fb3b7">
<img width="1470" alt="1-2" src="https://github.com/user-attachments/assets/9f55d322-ffa1-4958-a7dd-7e671edeeea5">


### **메인 페이지에는…**

유저 이름과 최근 테스트한 플롯의 1위 항목의 사진을 담은 **엽서**,

검색창으로 바로 갈 수 있는 **돋보기**,

새로운 플롯을 생성할 수 있는 **만년필**,

로그아웃을 위한 **메모지**,

원하는 카테고리로 바로가기 위한 9개의 **티켓들**,

그리고 나의 모든 역사를 담고 있는 **플롯 다이어리**가 있습니다.
<img width="1470" alt="2-1" src="https://github.com/user-attachments/assets/4a7a2632-ce23-4b44-b077-8e97bcb7a830">



### **검색창에서는…**

**플롯의 제목**을 검색하여 플롯을 찾을 수 있습니다.

불편함을 최소화하고자 원하는 항목이 포함된 플롯을 찾을 수 있도록 **항목 이름**으로도 검색이 가능합니다.

검색된 플롯을 누르면 테스트가 시작됩니다. 테스트는 **Merge Sort**로 구현하여 모든 항목의 순위가 나오도록 했습니다.

완료되면 **전체 순위**가 나오고, 기록이 다이어리에 저장됩니다. 최근 테스트한 플롯의 1순위 항목 이미지가 엽서에 적용된 걸 볼 수 있습니다.
<img width="1470" alt="3-2" src="https://github.com/user-attachments/assets/954389ff-1caa-4002-9e0b-e08717fb2cd5">
<img width="1470" alt="3-3" src="https://github.com/user-attachments/assets/35fa95dc-568b-40ed-a3e4-54c6ea5d8920">
<img width="1470" alt="3-4" src="https://github.com/user-attachments/assets/b8f452ef-c174-4575-8d7b-e875e88e22ad">


### **플롯 다이어리는…**

내비게이션을 적용한 티켓들을 이용하여 **해당 카테고리 페이지로 바로** 갈 수 있습니다. 

한 페이지마다 하나의 플롯 정보를 담고 있습니다. **가장 최근 순위로 정렬**되어 있으며, 이전의 기록과 비교하여 순위 변동을 보여줍니다.

제목을 누르면 이전에 테스트한 **모든 기록들을 한번에** 모아 볼 수 있습니다. 다시 하기 버튼으로 해당 플롯을 새로 테스트 할 수 있습니다.
<img width="1470" alt="2-2" src="https://github.com/user-attachments/assets/c87dfba7-98cb-4525-96ee-c96fb292813a">


### **플롯 생성은…**

펜을 누르면 **플롯 생성 페이지**로 이동합니다. 플롯의 제목, 설명, 카테고리, 항목 및 이미지들을 삭제 및 추가하여 플롯을 생성할 수 있습니다.
<img width="1470" alt="4-2" src="https://github.com/user-attachments/assets/1c961531-6b61-4e32-9b4d-1263c23bf0c1">



### **내가 만든 플롯은…**

**MYPLOTS 티켓**을 이용하여 내가 만든 플롯 페이지에서 볼 수 있습니다. 각 플롯을 클릭하면 해당 플롯의 항목들을 모두 볼 수 있습니다. **삭제하기**를 누르면 해당 플롯을 삭제 할 수 있습니다.
<img width="1470" alt="4-3" src="https://github.com/user-attachments/assets/05dd2bc9-b630-4cd4-a854-409686d6cd60">
<img width="1470" alt="4-4" src="https://github.com/user-attachments/assets/d58dec06-d472-4199-adf4-9c560257a2e8">


## Published Link
<br/>

[https://github.com/wlsdnqqq17/wlsdnqqq17.github.io](https://wlsdnqqq17.github.io/)
