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
