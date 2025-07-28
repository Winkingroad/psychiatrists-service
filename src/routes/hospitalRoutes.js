import { Router } from "express";
import { getHospitalById, getHospitals, getHospitalDetails } from "../controllers/hospitalController.js";

const router = Router();

// get all hospitals
router.get("/", getHospitals);
// get hospital by ID
router.get("/:id", getHospitalById);
// get hospital details
router.get("/details/:id", getHospitalDetails);

export default router;
