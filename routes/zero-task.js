import express from "express";
import controller from "../controllers/zeroth-task.js";

const router = express.Router();

router.get("/", controller);

export default router;
