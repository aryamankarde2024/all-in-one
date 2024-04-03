import express from "express";
import {
  home,
  getRegister,
  postRegister,
  getDetails,
} from "../controllers/express-demo.js";

const router = express.Router();

router.use(express.static("assets"));

router.use(express.urlencoded({ extended: true }));

router.get("/", home);

router.get("/register", getRegister);

router.post("/register", postRegister);

router.get("/details/:id", getDetails);

export default router;
