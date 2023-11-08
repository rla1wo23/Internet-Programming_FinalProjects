fetch("/concerts")
  .then((response) => response.json())
  .then((data) => {
    // 날짜별로 공연 정보를 그룹화
    const concertsByDate = groupConcertsByDate(data);

    // 날짜별로 정렬된 공연 정보를 출력
    Object.keys(concertsByDate)
      .sort()
      .forEach((date) => {
        const concerts = concertsByDate[date];
        const concertDate = new Date(concerts[0].concert_date);

        // 날짜 출력
        const dateHeading = document.createElement("h2");
        dateHeading.textContent = formatDate(concertDate);
        document.getElementById("concert-list").appendChild(dateHeading);

        // 공연 정보 출력
        concerts.sort(compareConcertTime).forEach((concert) => {
          const concertInfo = document.createElement("p");
          concertInfo.textContent = `${concert.concert_name}, ${
            concert.artist_name
          } - ${concert.venue_name}, ${formatTime(concert.concert_time)}`;

          const viewDetailsBtn = document.createElement("button");
          viewDetailsBtn.textContent = "View Details";

          viewDetailsBtn.addEventListener("click", () => {
            fetchConcertDetails(concert.concert_id);
          });

          concertInfo.appendChild(viewDetailsBtn);

          document.getElementById("concert-list").appendChild(concertInfo);
        });
      });
  })
  .catch((error) => console.error(error));

function fetchConcertDetails(concertId) {
  fetch(`/concerts/${concertId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("공연정보 업로드 오류");
      }
      return response.json();
    })
    .then((concert) => {
      displayConcertDetails(concert);
    })
    .catch((error) => console.error(error));
}

function displayConcertDetails(concert) {
  const concertDetailsContainer = document.getElementById("concert-details");
  concertDetailsContainer.innerHTML = "";

  const concertDetails = document.createElement("div");
  concertDetails.className = "concert-details";

  const concertName = document.createElement("p");
  concertName.textContent = `공연명: ${concert.concert_name}`;
  concertDetails.appendChild(concertName);

  const artistName = document.createElement("p");
  artistName.textContent = `아티스트명: ${concert.artist_name}`;
  concertDetails.appendChild(artistName);

  const venueName = document.createElement("p");
  venueName.textContent = `장소: ${concert.venue_name}`;
  concertDetails.appendChild(venueName);

  const concertDate = new Date(concert.concert_date);
  const formattedDate = formatDate(concertDate);

  const concertTime = formatTime(concert.concert_time);
  const dateTime = document.createElement("p");
  dateTime.textContent = `날짜: ${formattedDate}, 시간: ${concertTime}`;
  concertDetails.appendChild(dateTime);

  const ticketPrice = document.createElement("p");
  ticketPrice.textContent = `티켓 가격: ${concert.ticket_price}`;
  concertDetails.appendChild(ticketPrice);

  const buyLink = document.createElement("a");
  buyLink.href = "/buyTicket?concertId=" + concert.concert_id;
  buyLink.textContent = "바로 구매하기";
  concertDetails.appendChild(buyLink);

  concertDetailsContainer.appendChild(concertDetails);
  concertDetailsContainer.style.display = "block";
}

// 공연 정보를 날짜별로 그룹화하는 함수
function groupConcertsByDate(concerts) {
  const groupedConcerts = {};
  concerts.forEach((concert) => {
    const concertDate = new Date(concert.concert_date);
    const dateKey = concertDate.toISOString().split("T")[0];
    if (!groupedConcerts[dateKey]) {
      groupedConcerts[dateKey] = [];
    }
    groupedConcerts[dateKey].push(concert);
  });
  return groupedConcerts;
}

// 공연 시간을 오름차순으로 비교하는 함수
function compareConcertTime(a, b) {
  const timeA = a.concert_time.split(":");
  const timeB = b.concert_time.split(":");
  if (timeA[0] === timeB[0]) {
    return timeA[1] - timeB[1];
  }
  return timeA[0] - timeB[0];
}

// 날짜를 원하는 포맷으로 변환하는 함수
function formatDate(date) {
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  return `${month} ${day}일`;
}

// 시간을 원하는 포맷으로 변환하는 함수
function formatTime(time) {
  const [hour, minute] = time.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

// 공연 상세 정보 표시 함수
// 공연 상세 정보 표시 함수
