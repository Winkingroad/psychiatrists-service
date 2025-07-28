import connection from '../config/database.js';

// Get all patients from the database
export const getAllPatients = (callback) => {
    const query = 'SELECT * FROM patients';
    connection.query(query, callback);
}

// Get a patient by their ID
export const getPatientById = (id, callback) => {
    const query = 'SELECT * FROM patients WHERE id = ?';
    connection.query(query, id, callback);
}

// Register a new patient in the database
export const registerPatient = (data, callback) => {
    const query = 'INSERT INTO patients (name, address, email, phone, password, photo, psychiatristId) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, data, callback);
}

// Update patient details in the database
export const updatePatient = (id, data, callback) => {
    const query = 'UPDATE patients SET ? WHERE id = ?';
    console.log('SQL Query:', query); // Log the SQL query
    console.log('Data:', data); // Log the data object
    connection.query(query, [data, id], callback);
}

// Delete a patient from the database
export const deletePatient = (id, callback) => {
    const query = 'DELETE FROM patients WHERE id = ?';
    connection.query(query, id, callback);
}
