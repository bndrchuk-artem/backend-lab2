const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models'); 

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const recordRoutes = require('./routes/recordRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', recordRoutes);
app.use('/', currencyRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Lab v3.0 (PostgreSQL)',
    endpoints: {
      users: '/users, /user/:id',
      categories: '/category',
      records: '/record, /record/:id',
      currencies: '/currency'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Глобальний обробник помилок (для валідації та ін.)
app.use((err, req, res, next) => {
  if (err.isJoi) { 
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details.map(d => d.message)
    });
  }
  
  // Обробка помилок унікальності Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: err.errors.map(e => e.message)
    });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});


// Старт серверу та підключення до БД
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();