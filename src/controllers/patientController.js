import * as patientModel from '../models/patientModel.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name + "-" + req.body.psychiatristId + "-"  + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const patientSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().min(10).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).pattern(new RegExp('^[+91]{3}[0-9]{10}$')).required(),
    password: Joi.string().required(),
    psychiatristId: Joi.number().required(),
});

// Register a new patient
export const registerPatient = (req, res) => {
    const { error } = patientSchema.validate(req.body);

    if (error)
        return res.status(400).json({message: error.details[0].message});

    const { name, address, email, phone, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const photo = req.file.path;
    
    const data = [name, address, email, phone, hashedPassword, photo, req.body.psychiatristId];

    patientModel.registerPatient(data, (err, result) => {
        if (err)
            return res.status(500).json({message: err.message});

        // Send the registered patient details
        const registeredPatient = {
            id: result.insertId,
            name,
            address,
            email,
            phone,
            photo,
            psychiatristId: req.body.psychiatristId
        };

        return res.status(201).json({ message: 'Patient registered successfully', patient: registeredPatient });
    });
}

// Get all patients
export const getPatients = (req, res) => {
    patientModel.getAllPatients((err, result) => {
        if (err)
            return res.status(500).json({message: err.message});
        return res.status(200).json(result);
    });
}

// Get a patient by their ID
export const getPatientById = (req, res) => {
    const { error } = Joi.number().integer().positive().validate(req.params.id);
    if (error)
        return res.status(400).json({message: error.details[0].message});

    patientModel.getPatientById(req.params.id, (err, result) => {
        if (err)
            return res.status(500).json({message: err.message});
        if (result.length === 0)
            return res.status(404).json({message: 'No patient record found with ID: ' + req.params.id});
        return res.status(200).json(result);
    });
}

// Update a patient
export const updatePatient = (req, res) => {
    const { id } = req.params;
    const { name, address, email, phone, password, psychiatristId } = req.body;
    console.log('Request Body:', req.body);
    console.log('Request Params:', req.params);

    const updatedData = {};
    if (name) updatedData.name = name;
    if (address) updatedData.address = address;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (password) updatedData.password = bcrypt.hashSync(password, 10); // Hash the password if provided
    if (psychiatristId) updatedData.psychiatristId = psychiatristId;

    console.log('Updated Data:', updatedData);

    patientModel.updatePatient(id, updatedData, (err, result) => {
        if (err)
            return res.status(500).json({ message: err.message });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'No patient found with ID: ' + id });

        // Send the updated patient details
        const updatedPatient = { id, ...updatedData };

        return res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
    });
}


// Delete a patient
export const deletePatient = (req, res) => {
    const { id } = req.params; 

    patientModel.deletePatient(id, (err, result) => {
        if (err)
            return res.status(500).json({ message: err.message });

        // Check if any rows were affected (patient exists)
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'No patient found with ID: ' + id });

        return res.status(200).json({ message: 'Patient deleted successfully' });
    });
}

export const uploadProfilePicture = upload.single('photo');