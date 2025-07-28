import mysql from 'mysql2';
import faker from 'faker';

// Database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME ,
});

// Function to drop tables if they exist
const dropTables = () => {
    connection.promise().query('DROP TABLE IF EXISTS patients')
        .then(() => console.log('Patients table dropped'))
        .catch(err => console.error('Error dropping patients table:', err));

    connection.promise().query('DROP TABLE IF EXISTS psychiatrists')
        .then(() => console.log('Psychiatrists table dropped'))
        .catch(err => console.error('Error dropping psychiatrists table:', err));

    connection.promise().query('DROP TABLE IF EXISTS hospitals')
        .then(() => console.log('Hospitals table dropped'))
        .catch(err => console.error('Error dropping hospitals table:', err));
};

// Function to create tables
const createTables = () => {
    const createHospitalsTable = `
        CREATE TABLE IF NOT EXISTS hospitals (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    const createPsychiatristsTable = `
        CREATE TABLE IF NOT EXISTS psychiatrists (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            hospitalId INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (hospitalId) REFERENCES hospitals(id)
        )
    `;

    const createPatientsTable = `
        CREATE TABLE IF NOT EXISTS patients (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            address varchar(255) NOT NULL,
            email varchar(255) UNIQUE NOT NULL,
            phone varchar(15),
            password varchar(255) NOT NULL,   
            photo varchar(255) NOT NULL,
            psychiatristId INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (psychiatristId) REFERENCES psychiatrists(id)
        )
    `;

    connection.promise().query(createHospitalsTable)
        .then(() => console.log('Hospitals table created'))
        .catch(err => console.error('Error creating hospitals table:', err));

    connection.promise().query(createPsychiatristsTable)
        .then(() => console.log('Psychiatrists table created'))
        .catch(err => console.error('Error creating psychiatrists table:', err));

    connection.promise().query(createPatientsTable)
        .then(() => console.log('Patients table created'))
        .catch(err => console.error('Error creating patients table:', err));
};

// Function to generate random data
const generateRandomData = () => {
    // Generate random hospital names
    const hospitalNames = [
        'Apollo Hospitals',
        'Jawaharlal Nehru Medical College and Hospital',
        'Indira Gandhi Institute of Medical Sciences (IGIMS)',
        'AIIMS - All India Institute Of Medical Science'
    ];

    // Insert hospitals
    Promise.all(hospitalNames.map(name =>
        connection.promise().query('INSERT INTO hospitals (name) VALUES (?)', [name])
            .catch(err => console.error('Error inserting hospital:', err))
    ))
    .then(() => console.log('Hospitals inserted'))
    .catch(err => console.error('Error inserting hospitals:', err));

    // Get the list of hospital IDs
    connection.promise().query('SELECT id FROM hospitals')
        .then(([rows]) => {
            const hospitalIds = rows.map(row => row.id);

            // Insert psychiatrists
            const psychiatristPromises = [];
            for (const hospitalId of hospitalIds) {
                for (let i = 0; i < 5; i++) {
                    const name = faker.name.findName();
                    psychiatristPromises.push(
                        connection.promise().query('INSERT INTO psychiatrists (name, hospitalId) VALUES (?, ?)', [name, hospitalId])
                            .catch(err => console.error('Error inserting psychiatrist:', err))
                    );
                }
            }

            Promise.all(psychiatristPromises)
                .then(() => console.log('Psychiatrists inserted'))
                .catch(err => console.error('Error inserting psychiatrists:', err));

            // Get the list of psychiatrist IDs
            connection.promise().query('SELECT id FROM psychiatrists')
                .then(([rows]) => {
                    const psychiatristIds = rows.map(row => row.id);

                    // Insert patients
                    const patientPromises = [];
                    for (const psychiatristId of psychiatristIds) {
                        for (let i = 0; i < 5; i++) {
                            const name = faker.name.findName();
                            const address = faker.address.streetAddress();
                            const email = faker.internet.email();
                            const phoneNumber = faker.phone.phoneNumber('##########');
                            const password = faker.internet.password();
                            const profilePicture = 'photo.jpg';
                            patientPromises.push(
                                connection.promise().query('INSERT INTO patients (name, address, email, phone, password, photo, psychiatristId) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, address, email, phoneNumber, password, profilePicture, psychiatristId])
                                    .catch(err => console.error('Error inserting patient:', err))
                            );
                        }
                    }

                    Promise.all(patientPromises)
                        .then(() => {
                            console.log('Patients inserted');
                            // Close the database connection after all data has been inserted
                            connection.end();
                        })
                        .catch(err => console.error('Error inserting patients:', err));
                })
                .catch(err => console.error('Error fetching psychiatrist IDs:', err));
        })
        .catch(err => console.error('Error fetching hospital IDs:', err));
};

// Call the necessary functions
dropTables();
createTables();
generateRandomData();