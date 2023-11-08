// main.js

import "./style.css";

document.querySelector("#app").innerHTML = `
  <body>
    <header id="navigator">
        <nav>
            <ul>
                <li><a href="/goHome"><img src="../image/home.png"></a></li>
                <li><a href="/loginPage">회원가입/로그인 페이지</a></li>
                <li><a href="/board">공연요청 게시판</a></li>
                <li><a href="/goConcert">공연정보 보기</a></li>
                <li><a href="/adminPage">관리자 페이지</a></li>
                <li id="user-welcome"></li>
            </ul>
        </nav>
    </header>
    <section id="hero-section">
    <div class="hero-content">
      <h1>INDIE.INFO</h1>
        <p>인디 공연정보 전문 사이트</p>
      </div>
          <section id="content">
        <h1>공연정보 바로보러가기</h1>
        <a href="/goConcert" id="view-concert">바로가기</a>
    </section>
   </section>
</body>
`;

const userWelcomeElement = document.querySelector("#user-welcome");
const logoutButtonElement = document.createElement("button");
logoutButtonElement.textContent = "로그아웃";
logoutButtonElement.addEventListener("click", () => {
  fetch("/logout", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload(); // 페이지 새로고침
      }
    });
});

function checkSessionAndDisplayLogoutButton() {
  fetch("/getSession")
    .then((response) => response.json())
    .then((data) => {
      if (data.user_id) {
        userWelcomeElement.textContent = `${data.user_id}님 환영합니다.`;
        userWelcomeElement.appendChild(logoutButtonElement);
      } else {
        userWelcomeElement.textContent = "비회원입니다.";
        if (userWelcomeElement.contains(logoutButtonElement)) {
          userWelcomeElement.removeChild(logoutButtonElement);
        }
      }
    });
}

checkSessionAndDisplayLogoutButton();
