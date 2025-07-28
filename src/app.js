import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import patientRoutes from './routes/patientRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import psychiatristRoutes from './routes/psychiatristsRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

// Load your Swagger YAML file
const swaggerDocument = YAML.load('./src/swagger.yaml');

// Serve Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/patients', patientRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/psychiatrists', psychiatristRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
