import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.render("kuku-cube");
});

export default router;
