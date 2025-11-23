const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models'); 

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const recordRoutes = require('./routes/recordRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET_KEY) {
  console.error('FATAL ERROR: JWT_SECRET_KEY is not defined in environment variables.');
  process.exit(1);
}

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', recordRoutes);
app.use('/', currencyRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Lab v4.0 (JWT Auth)',
    status: 'OK',
    endpoints: {
      public: {
        register: 'POST /register',
        login: 'POST /login'
      },
      protected: {
        me: 'GET /me (current user info)',
        users: 'GET /users, GET /user/:id, DELETE /user/:id, PATCH /user/:id/default-currency',
        categories: 'GET /category, POST /category, DELETE /category/:id',
        records: 'GET /record, GET /record/:id, POST /record, DELETE /record/:id',
        currencies: 'GET /currency, POST /currency, DELETE /currency/:id'
      }
    },
    note: 'Protected endpoints require: Authorization: Bearer <token>'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  if (err.isJoi) { 
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details.map(d => d.message)
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: err.errors.map(e => e.message)
    });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();