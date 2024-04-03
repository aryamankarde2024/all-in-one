import express from "express";
import homeController from "../controllers/search-functionality.js";
const router = express.Router();

router.get("/", homeController);

export default router;
