import { Router } from "express";
import { getPatients, registerPatient, getPatientById, uploadProfilePicture, updatePatient, deletePatient } from "../controllers/patientController.js";

const router = Router();

// Get all patients
router.get("/", getPatients);
// Get patient by ID
router.get("/:id", getPatientById);
// Register a new patient
router.post("/register", uploadProfilePicture, registerPatient);
// Update patient details
router.put("/:id", uploadProfilePicture,updatePatient);
// Delete a patient
router.delete("/:id", deletePatient);

export default router;
