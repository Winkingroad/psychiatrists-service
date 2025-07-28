import connection from '../config/database.js';

export const getAllPsychiatrists = (callback) => {
    const query = 'SELECT * FROM psychiatrists';
    connection.query(query, callback);
}

export const getPsychiatristById = (id, callback) => {
    const query = 'SELECT * FROM psychiatrists WHERE id = ?';
    connection.query(query, id, callback);
}
