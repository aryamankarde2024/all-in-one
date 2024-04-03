import express from "express";
import controller from "../controllers/tic-tac-toe.js";

const router = express.Router();

router.get("/", controller);

export default router;
