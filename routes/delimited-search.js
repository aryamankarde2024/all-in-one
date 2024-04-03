import express from "express";
import controller from "../controllers/delimited-search.js";

const router = express.Router();

router.get("/", controller);

export default router;
