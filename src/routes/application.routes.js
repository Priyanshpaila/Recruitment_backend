import express from "express";
import { requireAuth } from "../middlewares/auth.js"; // Authentication middleware
import {
  submitApplication,
  viewApplication,
  updateApplication,
  getFormData,
} from "../controllers/application.controller.js";

const router = express.Router();

// Route for user to submit the application form
router.post("/submit", requireAuth, submitApplication);

// Route for admin to view the submitted application form
router.get("/:userId", requireAuth, viewApplication);

// Route for admin to update the application form (fill missing fields)
router.post("/application/update/:userId", requireAuth, updateApplication);

// Route to get the full form data (for frontend to generate PDF)
router.get("/application/data/:userId", requireAuth, getFormData);

export default router;
