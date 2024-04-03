import express from "express";
import {
  getAttendance,
  getReportCard,
  getResult,
  list,
  normalGrid,
  normalPagination,
} from "../controllers/pagination-demo.js";

const router = express.Router();

// Normal Grid
router.get("/", normalGrid);

// Normal Pagination
router.get("/pagination", normalPagination);

// Grid + Pagination
router.get("/list", list);

// Attendance
router.get("/attendance", getAttendance);

// Result & Report Card
router.get("/result", getResult);

router.get("/reportcard/:id", getReportCard);

export default router;
