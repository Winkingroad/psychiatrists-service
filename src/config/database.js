import { createConnection } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Yes we are ready to go');
});

export default connection;