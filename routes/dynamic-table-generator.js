import express from "express";
import controller from "../controllers/dynamic-table-generator-controller.js";

const router = express.Router();

router.get("/", controller);

export default router;
