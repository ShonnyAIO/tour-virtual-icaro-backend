require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const { sequelize, testConnection, syncModels } = require('./src/config/database');

// Test database connection on startup
const initializeDatabase = async () => {
  await testConnection();
  await syncModels();
};

// Initialize database connection
initializeDatabase().catch(console.error);

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Tour Virtual Ícaro API. Navigate to /api-docs for documentation.',
    database: {
      status: sequelize.authenticate() ? 'connected' : 'disconnected',
      dialect: 'postgresql'
    }
  });
});

// API Routes
const apiRouter = require('./src/routes/index.js');
app.use('/api', apiRouter);

// Centralized Error Handler
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
