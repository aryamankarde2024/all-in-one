import express from "express";
import connection from "./connection.js";
import cookieParser from "cookie-parser";
import { md5, randomString, generateToken, authenticate } from "./helper.js";
import r1 from "./routes/dynamic-table-generator.js";
import r2 from "./routes/kuku-cube.js";
import r3 from "./routes/tic-tac-toe.js";
import r4 from "./routes/events-matrix.js";
import r5 from "./routes/express-demo.js";
import r6 from "./routes/pagination-demo.js";
import r7 from "./routes/zero-task.js";
import r8 from "./routes/search-functionality.js";
import r9 from "./routes/delimited-search.js";
import r10 from "./routes/job-application-form.js";
import r11 from "./routes/job-application-form-step.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/register", (req, res) => {
  res.render("registration", { values: {} });
});

app.post("/register", (req, res) => {
  const values = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    username: req.body.username,
  };

  connection.query(
    "insert into login (fname, lname, email, username) values (?, ?, ?, ?)",
    Object.values(values),
    (err, results) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          values.error = "Please select a different username or email";
          res.render("registration", { values });
        } else {
          console.log(err);
          res.sendStatus(404);
        }
      } else {
        const code = randomString(12);
        const uniqueCode = `${req.rawHeaders[1]}/reset?code=${code}&username=${values.username}`;
        const timeLimit = 5 * 60000;
        const expiry = Number(Date.now()) + timeLimit;

        connection.query(
          "update login set link = ?, link_valid = ? where username = ? and email = ?",
          [code, expiry, values.username, values.email],
          (err, results) => {
            if (err) {
              console.log(err);
              res.sendStatus(404);
            } else {
              res.render("registration", {
                values: {
                  ...values,
                  uniqueCode,
                },
              });
            }
          }
        );
      }

      // OkPacket {
      //     fieldCount: 0,
      //     affectedRows: 1,
      //     insertId: 0,
      //     serverStatus: 2,
      //     warningCount: 0,
      //     message: '',
      //     protocol41: true,
      //     changedRows: 0
      //   }

      // code: 'ER_DUP_ENTRY',
      // errno: 1062,
      // sqlMessage: "Duplicate entry 'aryamankarde' for key 'login.username_UNIQUE'",
      // sqlState: '23000',
      // index: 0,
      // sql: "insert into login (fname, lname, email, username) values ('Aryaman', 'Karde', 'ak1@gmail.com', 'aryamankarde')"
      // }
    }
  );
});

app.get("/reset", (req, res) => {
  res.render("reset", { values: {} });
});

app.post("/reset", (req, res) => {
  try {
    let urlObj = new URLSearchParams(req.query);

    if (req.body.password !== req.body.confirmPassword) {
      res.render("reset", {
        values: {
          error: "Confirm Password and Password must match.",
        },
      });
    } else if (!urlObj.has("username") || !urlObj.has("code")) {
      res.render("reset", {
        values: {
          error: "Link is invalid.",
        },
      });
    } else {
      connection.query(
        "select link_valid from login where username = ? and link = ?",
        [urlObj.get("username"), urlObj.get("code")],
        (err, results) => {
          if (err) {
            console.log(err);
            res.sendStatus(404);
          } else {
            if (Date.now() <= results[0].link_valid) {
              const salt = randomString(4);
              const password = md5(salt + req.body.password);

              connection.query(
                "update login set password = ?, salt = ?, link_valid = ? where username = ? and link = ?",
                [
                  password,
                  salt,
                  Date.now() - 1,
                  urlObj.get("username"),
                  urlObj.get("code"),
                ],
                (err, results) => {
                  if (err) {
                    console.log(err);
                    res.sendStatus(404);
                  } else {
                    res.send(`
                                        <p>Successfully Logged In !</p>
                                    `);
                  }
                }
              );
            } else {
              res.render("reset", {
                values: {
                  error: "Link expired.",
                },
              });
            }
          }
        }
      );
    }
  } catch (error) {
    res.render("reset", {
      values: {
        error: "Something went wrong.",
      },
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { values: {} });
});

app.post("/login", (req, res) => {
  try {
    connection.query(
      "select salt from login where username = ?",
      [req.body.username],
      (err, results) => {
        if (err) {
          console.log(err);
          res.render("login", {
            values: {
              error: "Username or Password didn't match",
            },
          });
        } else if (results.length) {
          const salt = results[0].salt;
          const password = md5(salt + req.body.password);

          connection.query(
            "select fname from login where username = ? and password = ?",
            [req.body.username, password],
            (err, results) => {
              if (err) {
                console.log(err);
                res.render("login", {
                  values: {
                    error: "Username or Password didn't match",
                  },
                });
              } else {
                if (!results.length) {
                  res.render("login", {
                    values: {
                      error: "Username or Password didn't match",
                    },
                  });
                } else {
                  let token = generateToken(req.body.username);
                  res.cookie("Token", token);
                  res.redirect("/");
                }
              }
            }
          );
        } else {
          res.render("login", {
            values: {
              error: "Username or Password didn't match",
            },
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.render("login", {
      values: {
        error: "Username or Password didn't match",
      },
    });
  }
});

app.get("/forgot", (req, res) => {
  res.render("forgot", { values: {} });
});

app.post("/forgot", (req, res) => {
  try {
    const username = req.body.username;
    const code = randomString(12);
    const message = `Use below link to reset password <br>${req.rawHeaders[1]}/reset?code=${code}&username=${username}`;
    const timeLimit = 5 * 60000;
    const expiry = Number(Date.now()) + timeLimit;

    connection.query(
      "update login set link = ?, link_valid = ? where username = ?",
      [code, expiry, username],
      (err, results) => {
        if (results.affectedRows) {
          res.render("forgot", {
            values: {
              message,
            },
          });
        } else {
          res.render("forgot", {
            values: {
              message: "Please try again !",
            },
          });
        }
      }
    );
  } catch (error) {
    res.render("forgot", {
      values: {
        message: "Please try again !",
      },
    });
  }
});

app.use("/", authenticate);

app.get("/", (_, res) => {
  const list = {
    "Dynamic Table Generator": "dyanamic-table-generator",
    "Kuku Cube": "kuku-cube",
    "Tic Tac Toe": "tic-tac-toe",
    "Events Matrix Board": "events-matrix",
    "Express demo (Stores Data in a JSON file)": "express-demo",
    "Basic grid": "pagination-demo/list",
    "Basic pagination": "pagination-demo/pagination",
    "Grid + Pagination": "pagination-demo",
    Attendance: "pagination-demo/attendance",
    Result: "pagination-demo/result",
    "Zero(th) Task Optimized": "zero-task",
    "Search Functionality": "search-functionality",
    "Delimited Search": "delimited-search",
    "Job Application Form": "job-application-form",
    "Job Application Form Step": "job-application-form-step",
  };

  let counter = 1;
  res.render("dashboard", { list, counter });
});

app.use("/dyanamic-table-generator", r1);
app.use("/kuku-cube", r2);
app.use("/tic-tac-toe", r3);
app.use("/events-matrix", r4);
app.use("/express-demo", r5);
app.use("/pagination-demo", r6);
app.use("/zero-task", r7);
app.use("/search-functionality", r8);
app.use("/delimited-search", r9);
app.use("/job-application-form", r10);
app.use("/job-application-form-step", r11);

app.listen("8000", (err) => {
  console.log("Server listening on port 8000", err);
});
