import * as hospitalModel from '../models/hospitalModel.js';
import Joi from 'joi';

// Get all hospitals
export const getHospitals = (req, res) => {
    hospitalModel.getAllHospitals((err, result) => {
        if (err)
            return res.status(500).json({message: err.message});
        return res.status(200).json(result);
    });
}

// Get hospital by ID
export const getHospitalById = (req, res) => {
    const { error } = Joi.number().integer().positive().validate(req.params.id);
    if (error)
        return res.status(400).json({message: error.details[0].message});

    hospitalModel.getHospitalById(req.params.id, (err, result) => {
        if (err)
            return res.status(500).json({message: err.message});

        if (result.length === 0)
            return res.status(404).json({message: 'No hospital record found with ID: ' + req.params.id});
        return res.status(200).json(result);
    });
}

// Get hospital details
export const getHospitalDetails = (req, res) => {
    const { error } = Joi.number().integer().positive().validate(req.params.id);
    if (error)
        return res.status(400).json({message: error.details[0].message});

    hospitalModel.getHospitalDetails(req.params.id, (err, result) => {
        if (err)
            return res.status(500).json({message: err.message});
        
        return res.status(200).json(result);
    });
}
