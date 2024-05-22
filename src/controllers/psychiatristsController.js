import * as psychiatristModel from '../models/psychiatristModel.js';
import Joi from 'joi';

// Get all psychiatrists
export const getPsychiatrists = (req, res) => {
    psychiatristModel.getAllPsychiatrists((err, result) => {
        if (err)
            return res.status(500).json({message: err.message});
        return res.status(200).json(result);
    });
}

// Get psychiatrist by ID
export const getPsychiatristById = (req, res) => {
    const { error } = Joi.number().integer().positive().validate(req.params.id);
    if (error)
        return res.status(400).json({message: error.details[0].message});
    
    psychiatristModel.getPsychiatristById(req.params.id, (err, result) => {
        if (err)
            return res.status(500).json({message: err.message});

        if (result.length === 0)
            return res.status(404).json({message: 'No psychiatrist record found with ID: ' + req.params.id});
        return res.status(200).json(result);
    });
}
