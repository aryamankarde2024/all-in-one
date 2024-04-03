import express from "express";
import controller from "../controllers/kuku-cube.js";

const router = express.Router();

router.get("/", controller);

export default router;
