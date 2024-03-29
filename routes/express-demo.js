import express from "express";
import { promises as fs } from "fs";

const router = express.Router();

router.use(express.static("assets"));

router.use(express.urlencoded({ extended: true }));

router.get("/", (_, res) => {
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
});

router.get("/register", (_, res) => {
  res.render("express-demo/register");
});

router.post("/register", (req, res) => {
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
});

router.get("/details/:id", (req, res) => {
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
});

export default router;
