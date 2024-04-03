import express from "express";
import controller from "../controllers/events-matrix.js";

const router = express.Router();

router.get("/", controller);

export default router;
