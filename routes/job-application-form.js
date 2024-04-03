import express from "express";
import {
  getById,
  home,
  postById,
  postHome,
} from "../controllers/job-application-form.js";

const router = express.Router();

router.get("/", home);

router.post("/", postHome);

router.get("/:id", getById);

router.post("/:id", postById);

export default router;
