import express from "express";
import mysql from "mysql";
import { md5, randomString } from "./helper.js";

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "students",
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

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
          console.log(results);
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
                  res.send(`
                                        <p>Successfully Logged In !</p>
                                        <p>Hello ${results[0].fname}</p>
                                    `);
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

app.listen("8000", (err) => {
  console.log("Server listening on port 8000", err);
});
