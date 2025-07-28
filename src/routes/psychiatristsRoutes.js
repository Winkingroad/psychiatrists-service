import { Router } from "express";
import { getPsychiatristById, getPsychiatrists } from "../controllers/psychiatristsController.js";

const router = Router();

// get all psychiatrists
router.get("/", getPsychiatrists);
// get psychiatrist by ID
router.get("/:id", getPsychiatristById);

export default router;
