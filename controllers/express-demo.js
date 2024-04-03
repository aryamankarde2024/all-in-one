import { promises as fs } from "fs";

export function home(_, res) {
  res.type(".html");
  fs.stat("users.json")
    .then(() => {
      fs.readFile("users.json").then((data) => {
        data = JSON.parse(data);
        res.render("express-demo/home", { data });
      });
    })
    .catch(() => {
      res.render("express-demo/home", { data: [] });
    });
}

export function getRegister(_, res) {
  res.render("express-demo/register");
}

export function postRegister(req, res) {
  const data = req.body;
  fs.stat("users.json")
    .then(() => {
      fs.readFile("users.json").then((fileData) => {
        fileData = JSON.parse(fileData);
        fileData.push({ ...data, created_at: Date.now() });
        fs.writeFile("users.json", JSON.stringify(fileData));
      });
    })
    .catch(() => {
      fs.writeFile(
        "users.json",
        JSON.stringify([{ ...data, created_at: Date.now() }])
      );
    })
    .finally(() => {
      res.redirect("/express-demo");
    });
}

export function getDetails(req, res) {
  fs.stat("users.json")
    .then(() => {
      fs.readFile("users.json").then((fileData) => {
        fileData = JSON.parse(fileData);
        res.render("express-demo/details", {
          data: fileData.find((d) => d.created_at == req.params.id),
        });
      });
    })
    .catch(() => {
      res.redirect("/express-demo");
    });
}
