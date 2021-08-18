const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* Creating a session to store the user information */
app.use(
  session({
    key: "user",
    secret: "stressScale",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

/* Creating Database connection */
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "PatriciaDominik21G",
  database: "stressscale",
});

/* Handaling post requests on path '/login' */
app.post("/api/login", (req, res, next) => {
  const userId = req.body.userId;
  const userPassword = req.body.userPassword;

  /* Getting and storing current date and time */
  const date = new Date();
  const dateData =
    // '"' +
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString() +
    "-" +
    date.getDate().toString() +
    " " +
    date.getHours().toString() +
    ":" +
    date.getMinutes().toString() +
    ":" +
    date.getSeconds().toString() +
    "";
  console.log("JS DATE: ", dateData);

  /*Selecting the users with ID, Password to see if that user is in database*/
  db.query(
    `SELECT day_to_score.*, users.*
	FROM users 
		LEFT JOIN day_to_score ON day_to_score.user_id = users.id
	WHERE users.uid = ? AND users.password = ?`,
    [userId, userPassword],
    (err, result) => {
      if (err) {
        res.send({
          message: err,
        });
      } else if (result.length > 0) {
        //Setting Session
		// We care only about the first result data for the session
        req.session.user = result[0];
		console.log("SESSION" ,req.session);
        /* Checking date and time with last logged in date and time */
        let dbDate = result[0].lastLogin;
        if (dbDate === null) {
          dbDate = "0000-00-00 00:00:00";
        }
        console.log("dbDate: ", dbDate.toString());
        const dbDateYear = dbDate.split(" ")[0].split("-")[0];
        const dbDateMonth = dbDate.split(" ")[0].split("-")[1];
        const dbDateDate = dbDate.split(" ")[0].split("-")[2];
        const dbDateHour = dbDate.split(" ")[1].split(":")[0];
        const dbDateMinute = dbDate.split(" ")[1].split(":")[1];
        console.log(
          "DB DATE: ",
          dbDateYear,
          dbDateMonth,
          dbDateDate,
          dbDateHour,
          dbDateMinute
        );
        if (date.getFullYear().toString() - dbDateYear >= 0) {
          if ((date.getMonth() + 1).toString() - dbDateMonth >= 0) {
            if (date.getDate().toString() - dbDateDate > 0) {
              // if (date.getHours().toString() - dbDateHour > 0) {
              // if (date.getMinutes().toString() - dbDateMinute > 0) {
              console.log("Logged!");

              /* Updating date and time in database  and preventing user from logging in more than once a day */
              db.query(
                "UPDATE users SET lastLogin = ? WHERE uid = ?",
                [dateData, userId],
                (err1, result1) => {
                  if (err1) {
                    console.log(err1);
                  } else {
                    console.log(result1);
                    res.send({
                      message: result,
                    });
                  }
                }
              );
              // } else {
              //    console.log("You are allowed to login again next minute");
              //   res.send({ fail: "You are allowed to login again next minute" });
              // }
              // } else {
              //   console.log("You are allowed to login again next hour");
              //   res.send({ fail: "You are allowed to login again next hour" });
              // }
            } else {
              	console.log("You are allowed to login again next day");
            	//    res.send({ fail: "You are allowed to login again next day" });
				res.send({message: result, fail: "You are allowed to login again next day"});
            }
          } else {
            	console.log("You are allowed to login again next month");
            	//  res.send({ fail: "You are allowed to login again next month" });
				res.send({message: result, fail: "You are allowed to login again next month"});
          }
        } else {
          		console.log("You are allowed to login again next year");
        	    // res.send({ fail: "You are allowed to login again next year" });
				res.send({message: result, fail: "You are allowed to login again next year"});
        }
      } else {
        // res.send({ message: "User Id and Password combination wrong!" });
		res.send({message: "User Id and Password combination wrong!"});
      }
    }
  );
});

/* Handaling post requests on path '/register' */
app.post("/api/register", (req, res, next) => {
  const userId = req.body.userId;
  const userPassword = req.body.userPassword;

  /*Selecting the users with ID, Password to see if that user is already in database*/
  db.query("SELECT * FROM users WHERE uid = ?", [userId], (err, result) => {
    if (err) {
      res.send({
        message: err,
      });
    } else if (result.length > 0) {
      res.send({
        message: "User already exists, please choose a different User ID.",
      });
    } else {
      /* If user not in database, then create user with ID, Password, and put in database */
      db.query(
        "INSERT INTO users (uid, password) VALUES (?, ?)",
        [userId, userPassword],
        (err, result) => {
          if (err) {
            res.send({
              message: err,
            });
          } else if (result) {
            res.send({
              message:
                "User registered successfully. Please Login to continue!",
            });
          } else {
            res.send({ message: "Some unrecognizable error occured!" });
          }
        }
      );
    }
  });
});

/* Handaling get requests for path '/login' */
app.get("/api/login", (req, res, next) => {
  if (req.session.user) {
    /* Sending session information to the client */
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

/* Adding score to database for logged in user */
app.post("/api/addScore", (req, res, next) => {
	console.log("add score")
  const userId = req.body.userId;
  const score = req.body.dailyScore;
  const day = req.body.day;
  const session =  req.session.user;
  // let scoreMessage = "";
  console.log("User ID: " + userId);
  console.log("Today's Score: " + score);

  db.query(
  	"INSERT INTO day_to_score (user_id, day, score) VALUES (?, ?, ?)",
  	[session.id, day, score],
  	(err, result) => {
  	  if (err) {
  		console.log(err);
  	  } else {
  		console.log("day " + day + ": " + result);
  	  }
  	}
  );
  
  res.status(200).send();
});

/* Handaling post requests for '/showScore' path */
app.post("/api/showScore", (req, res, next) => {
  const userId = req.body.userId;
  console.log("User ID: ", userId);
  const score = req.body.dailyScore;
  console.log("Score: ", score);
  const session =  req.session.user;
  db.query("SELECT day, score FROM day_to_score WHERE user_id = ?", [session.id], (err, result) => {
    if (err) {
      console.log(err);
    } else if (result || result.length > 0) {
		console.log("show score", result)
    	res.send({ scoreMessage: JSON.stringify(result) });

    } else {
      console.log("Some unrecognizable error!");
    }
  });
});

/* Running the server on Port 3001 */
app.listen(3001, () => {
  console.log("App running!");
});

/*  Database - stressScale
    Table - users
    Columns - id, uid, password, day1, day2, day3, day4, day5, lastLogin
*/
