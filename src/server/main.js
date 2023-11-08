const express = require("express");
const ViteExpress = require("vite-express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client"))); //client측 root directory 고정
ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
); //리스닝, 포트 3000번에서

app.get("/signupPage", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/pages/signup.html"));
}); //클라이언트에서 get 요청이 오면 response하는 함수

app.get("/goHome", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../../index.html"));
}); //클라이언트에서 get 요청이 오면 response하는 함수

app.get("/buyTicket", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/pages/buyTicket.html"));
}); //클라이언트에서 get 요청이 오면 response하는 함수

app.get("/goConcert", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/pages/concert-info.html"));
}); //클라이언트에서 get 요청이 오면 response하는 함수

app.get("/board", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/pages/board.html"));
}); //클라이언트에서 get 요청이 오면 response하는 함수

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS가 아닌 경우에는 false로 설정
  }),
);

app.get("/loginPage", function (req, res) {
  if (req.session.user_id) {
    res.sendFile(path.resolve(__dirname, "../client/pages/mypage.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "../client/pages/login.html"));
  }
});

app.get("/adminPage", (req, res) => {
  const user_permission = req.session.user_permission;
  console.log(user_permission);
  if (user_permission === "admin") {
    res.sendFile(path.resolve(__dirname, "../client/pages/admin.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "../client/pages/reject.html"));
  }
});

//db연결 과정
const conn = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "project",
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected to MySQL");
});

//회원가입 함수입니다.
app.post("/signup", function (req, res) {
  // 클라이언트에서 전송된 회원가입 정보를 받아옵니다.
  const { user_id, user_pw, user_name, user_birthday, user_mail, user_gender } =
    req.body;

  // 중복된 아이디 체크
  const checkQuery =
    "SELECT COUNT(*) AS count FROM user_info WHERE user_id = ?";
  conn.query(checkQuery, [user_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "서버 오류" });
    } else {
      const count = result[0].count;
      if (count > 0) {
        // 이미 가입된 아이디인 경우
        res.status(200).json({ message: "이미 가입된 아이디입니다." });
      } else {
        // 회원가입 정보를 저장
        const query =
          "INSERT INTO user_info (user_id, user_pw, user_name, user_birthday, user_mail, user_permission, user_gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
          user_id,
          user_pw,
          user_name,
          user_birthday,
          user_mail,
          "user",
          user_gender,
        ];
        conn.query(query, values, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "회원가입에 실패했습니다." });
          } else {
            res.status(200).json({
              message:
                "회원가입이 완료되었습니다. 로그인 페이지에서 로그인 해주세요.",
            });
          }
        });
      }
    }
  });
});

//로그인 세션 및 db 연동부입니다./////////////////////////////////////////

app.post("/login", function (req, res) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;

  // 아이디와 비밀번호 확인
  const query = "SELECT * FROM user_info WHERE user_id = ? AND user_pw = ?";
  conn.query(query, [user_id, user_pw], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "서버 오류" });
    } else {
      if (result.length > 0) {
        // 로그인 성공
        var user_id = result[0].user_id;
        var user_permission = result[0].user_permission;
        req.session.user_id = user_id;
        req.session.user_permission = user_permission;
        res.json({ success: true, message: "로그인 성공" });
      } else {
        // 로그인 실패
        res.status(200);
        res.json({ success: false, message: "없는 회원 정보입니다." });
      }
    }
  });
});

// 세션 정보 가져오기
app.get("/getSession", function (req, res) {
  const user_id = req.session.user_id;
  res.json({ user_id });
});

//관리자 페이지 로직
app.post("/registerTicket", (req, res) => {
  const { ticket_price, ticket_corp } = req.body;
  console.log(ticket_price);
  console.log(ticket_corp);
  // ticket_info 테이블에 공연 정보 등록하는 로직 작성
  const sql =
    "INSERT INTO ticket_info (ticket_price, ticket_corp) VALUES (?, ?)";
  conn.query(sql, [ticket_price, ticket_corp], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.send("공연 정보가 성공적으로 등록되었습니다.");
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 중 오류 발생:", err);
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// [musicians] 테이블에 아티스트 정보 등록하기
app.post("/registerArtist", (req, res) => {
  const { artist_name } = req.body;

  // musicians 테이블에 아티스트 정보 등록하는 로직 작성
  const sql = "INSERT INTO musicians (artist_name) VALUES (?)";
  conn.query(sql, [artist_name], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.send("아티스트 정보가 성공적으로 등록되었습니다.");
  });
});

// [venues] 테이블에 공연 장소 정보 등록하기
app.post("/registerVenue", (req, res) => {
  const { venue_id, venue_name, venue_address } = req.body;

  // venues 테이블에 공연 장소 정보 등록하는 로직 작성
  const sql =
    "INSERT INTO venues (venue_id, venue_name, venue_address) VALUES (?, ?, ?)";
  conn.query(sql, [venue_id, venue_name, venue_address], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.send("공연 장소 정보가 성공적으로 등록되었습니다.");
  });
});

// [concert_info] 테이블에 공연 정보 등록하기
app.post("/registerConcert", (req, res) => {
  const {
    artist_name,
    venue_name,
    ticket_id,
    concert_name,
    concert_date,
    concert_time,
  } = req.body;
  console.log(artist_name);
  const getArtistIdQuery =
    "SELECT artist_id FROM musicians WHERE artist_name = ?";
  const getVenueIdQuery = "SELECT venue_id FROM venues WHERE venue_name = ?";
  const insertConcertQuery =
    "INSERT INTO concert_info (artist_id, venue_id, ticket_id, concert_name, concert_date, concert_time) VALUES (?, ?, ?, ?, ?, ?)";

  conn.query(getArtistIdQuery, [artist_name], (err, artistResult) => {
    if (err) {
      console.error(err);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (artistResult.length === 0) {
      res.status(400).send("해당 아티스트를 찾을 수 없습니다.");
      return;
    }

    const artist_id = artistResult[0].artist_id;

    conn.query(getVenueIdQuery, [venue_name], (err, venueResult) => {
      if (err) {
        console.error(err);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }

      if (venueResult.length === 0) {
        res.status(400).send("해당 공연 장소를 찾을 수 없습니다.");
        return;
      }

      const venue_id = venueResult[0].venue_id;

      conn.query(
        insertConcertQuery,
        [
          artist_id,
          venue_id,
          ticket_id,
          concert_name,
          concert_date,
          concert_time,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("서버 오류가 발생했습니다.");
            return;
          }

          res.send("공연 정보가 성공적으로 등록되었습니다.");
        },
      );
    });
  });
});

// 공연 정보 조회 엔드포인트 구현부분입니다.
app.get("/concerts", (req, res) => {
  // concert_info 테이블과 연관된 정보를 조인하여 모든 공연 정보를 가져옴
  const query = `
    SELECT ci.concert_id, ci.concert_name, ci.concert_img, ci.concert_date, ci.concert_time, m.artist_name, v.venue_name
    FROM concert_info ci
    JOIN musicians m ON ci.artist_id = m.artist_id
    JOIN venues v ON ci.venue_id = v.venue_id
  `;

  // 쿼리 실행
  conn.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // 결과를 JSON 형식으로 응답
    res.json(result);
  });
});

app.get("/concerts/:id", (req, res) => {
  const concertId = req.params.id;
  const query = `
    SELECT ci.concert_name, m.artist_name, v.venue_name, ci.concert_date, ci.concert_time, ti.ticket_price
    FROM concert_info ci
    JOIN musicians m ON ci.artist_id = m.artist_id
    JOIN venues v ON ci.venue_id = v.venue_id
    JOIN ticket_info ti ON ci.ticket_id = ti.ticket_id
    WHERE ci.concert_id = ?
  `;
  console.log("이 부분입니다;");
  console.log(concertId);
  console.log("이 부분입니다;");
  conn.query(query, [concertId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Concert not found");
      return;
    }

    const concertInfo = result[0];
    console.log(concertInfo);
    res.json(concertInfo);
  });
});

//게시글 페이지 부분입니다.
app.get("/boarding", (req, res) => {
  const query = "SELECT * FROM note";
  conn.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }
    // 결과를 배열로 변환하여 전달
    const dataArray = Array.from(results);
    res.send(dataArray);
  });
});

// 게시글 작성 페이지
app.get("/writing", (req, res) => {
  // 로그인 체크
  if (!req.session.user_id) {
    res.redirect("/loginPage"); // 로그인 페이지로 리다이렉트
  } else {
    res.sendFile(path.resolve(__dirname, "../client/pages/writing.html"));
  }
});

// 게시글 작성
app.post("/writing", (req, res) => {
  const { note_title, note_content } = req.body;
  const note_upload = new Date();
  const user_id = req.session.user_id;

  const query =
    "INSERT INTO note (note_title, note_content, note_upload, user_id) VALUES (?, ?, ?, ?)";
  conn.query(
    query,
    [note_title, note_content, note_upload, user_id],
    (err, result) => {
      if (err) throw err;
      res.send({ message: "게시글이 등록되었습니다." });
    },
  );
});

//
app.get("/contents/:id", (req, res) => {
  const noteId = req.params.id;
  const query = "SELECT * FROM note WHERE note_id = ?";

  conn.query(query, [noteId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }

    res.send(results);
  });
});

// 게시글 삭제
app.post("/delete/:id", (req, res) => {
  const noteId = req.params.id;
  const userId = req.session.user_id;
  const userPermission = req.session.user_permission;
  console.log(noteId);
  if (!userId) {
    res.send("권한이 없습니다.");
    return;
  }

  const query = "SELECT user_id FROM note WHERE note_id = ?";
  conn.query(query, [noteId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      console.log("this case3");
      res.send("권한이 없습니다.");
      return;
    }

    const postUserId = results[0].user_id;
    if (userPermission !== "admin" && postUserId !== userId) {
      console.log("this case2");
      res.send("권한이 없습니다.");
      return;
    }
    const deleteQuery = "DELETE FROM note WHERE note_id = ?";
    conn.query(deleteQuery, [noteId], (err) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send("게시글이 정상적으로 삭제되었습니다.");
    });
  });
});
