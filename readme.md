# Psychiatrist Platform

## Description
Welcome to the Psychiatrist Platform project! This platform provides APIs for managing patients, hospitals, and psychiatrists. Below are the details of libraries/frameworks used and API endpoints.


## Installation
- Clone the repository
```bash
git clone https://github.com/Winkingroad/psychiatrists-service.git
```
- Navigate to the project directory
```bash
cd psychiatrist-platform
```
- Install the dependencies
```bash
npm install
```
- Create a `.env` file in the root directory and add the following environment variables
```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospitaldb
```
- Import the database dump file `hospitaldb.sql` in the `database` folder

### OR

- Run the file in `src/utils/index.js` to create the database and tables 
```bash
node src/utils/index.js
```
***This will automatically generate the random data of patients for each hospital and psychiatrist and also the hospitals and psychiatrists data***

- Start the server
```bash
npm dev
```
- Access the APIs at `http://localhost:3000/api/patients` or `http://localhost:3000/api/hospitals` or `http://localhost:3000/api/psychiatrists`




## Libraries/Frameworks Used
- `Express.js (Node.js)` - for building the server and APIs 
- `mysql2` - for connecting to MySQL database and executing queries 
- `dotenv` - for loading environment variables from .env file
- `bycrypt` - for hashing passwords 
- `body-parser` - for parsing request bodies 
- `swagger-ui-express` - for API documentation
- `faker` - for generating fake data for making the dummy data for insertion
- `multer` - for uploading files 

## API Endpoints

### Patients
- GET /api/patients - Get all patients
- GET /api/patients/:id - Get a patient by id
- POST /api/patients/register - Register a patient
- PUT /api/patients/:id - Update a patient by id
- DELETE /api/patients/:id - Delete a patient by id

### Hospitals
- GET /api/hospitals - Get all hospitals
- GET /api/hospitals/:id - Get a hospital by id
- GET /api/hospitals/details/:id - Get a hospital details by id

### Psychiatrists
- GET /api/psychiatrists - Get all psychiatrists
- GET /api/psychiatrists/:id - Get a psychiatrist by id

## Swagger Documentation
- Interactive API documentation is available via Swagger UI. You can access it at:
    - http://localhost:3000/api-docs

## Postman Collection
- Postman collection is available in the `psychiatrist-platform.postman_collection.json` file

## Database Dump and Database Schema
- Database dump is available in the `database` folder
- Database schema is available in the `database` folder

#### hospitalModel
- `hospitalId` : primary key
- `hospitalName` : name of the hospital

#### patientModel
- `patientId` : primary key
- `name` : name of the patient
- `email` : email of the patient
- `password` : password of the patient
- `phone` : phone number of the patient
- `address` : address of the patient
- `psychiatristId` : foreign key
- `photo` : photo of the patient

#### psychiatristModel
- `psychiatristId` : primary key
- `name` : name of the psychiatrist
- `hospitalId` : foreign key


