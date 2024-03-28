import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.render("dynamic-table-generator");
});

export default router;
