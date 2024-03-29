import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.render("events-matrix");
});

export default router;
