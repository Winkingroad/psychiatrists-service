import connection from '../config/database.js';

// Get all hospitals from the database
export const getAllHospitals = (callback) => {
    const query = 'SELECT * FROM hospitals';
    connection.query(query, callback);
}

// Get a hospital by their ID
export const getHospitalById = (id, callback) => {
    const query = 'SELECT * FROM hospitals WHERE id = ?';
    connection.query(query, id, callback);
}

// Get hospital details
export const getHospitalDetails = (id, callback) => {
    const query = `SELECT h.name as hospital_name,
                        COUNT(DISTINCT p.id) as totalPatients,
                        COUNT(DISTINCT ps.id) as totalPsychiatrists
                    FROM hospitals h
                    LEFT JOIN psychiatrists ps ON h.id = ps.hospitalId
                    LEFT JOIN patients p ON ps.id = p.psychiatristId
                    WHERE h.id = ?`;

    const query1 = `SELECT ps.id as id, ps.name as name, COUNT(p.id) as patientsCount
                    FROM psychiatrists ps
                    LEFT JOIN patients p ON ps.id = p.psychiatristId
                    WHERE ps.hospitalId = ?
                    GROUP BY ps.id`;

    connection.query(query, id, (err, hospitalResult) => {
        if (err) {
            callback(err);
        } else {
            if (hospitalResult.length === 0) {
                callback({message: 'No hospital record found with ID: ' + id});
            } else {
                connection.query(query1, id, (err, psychiatristResult) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, {
                            hospital_name: hospitalResult[0].hospital_name,
                            total_psychiatrists: hospitalResult[0].totalPsychiatrists,
                            total_patients: hospitalResult[0].totalPatients,
                            psychiatrist_details: psychiatristResult
                        });
                    }
                });
            }
        }
    });
}
