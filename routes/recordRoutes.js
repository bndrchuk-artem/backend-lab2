const express = require('express');
const router = express.Router();
const storage = require('../data/storage');

router.get('/record/:record_id', (req, res) => {
  const recordId = parseInt(req.params.record_id);
  const record = storage.records[recordId];
  
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  
  res.json(record);
});

// GET /record - отримати записи з фільтрацією
router.get('/record', (req, res) => {
  const { user_id, category_id } = req.query;
  
  // Перевірка наявності хоча б одного параметра
  if (!user_id && !category_id) {
    return res.status(400).json({ 
      error: 'At least one parameter (user_id or category_id) is required' 
    });
  }
  
  let records = Object.values(storage.records);
  
  // Фільтрація по user_id
  if (user_id) {
    const userId = parseInt(user_id);
    records = records.filter(record => record.user_id === userId);
  }
  
  // Фільтрація по category_id
  if (category_id) {
    const categoryId = parseInt(category_id);
    records = records.filter(record => record.category_id === categoryId);
  }
  
  res.json({ 
    records, 
    count: records.length,
    filters: { user_id, category_id }
  });
});

// POST /record - створити новий запис
router.post('/record', (req, res) => {
  const { user_id, category_id, amount } = req.body;
  
  // Базова валідація
  if (!user_id || !category_id || amount === undefined) {
    return res.status(400).json({ 
      error: 'user_id, category_id and amount are required' 
    });
  }
  
  const userId = parseInt(user_id);
  const categoryId = parseInt(category_id);
  const numAmount = parseFloat(amount);
  
  if (!storage.users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!storage.categories[categoryId]) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  
  const newRecord = {
    id: storage.recordIdCounter++,
    user_id: userId,
    category_id: categoryId,
    created_at: new Date().toISOString(),
    amount: numAmount
  };
  
  storage.records[newRecord.id] = newRecord;
  
  res.status(201).json(newRecord);
});

router.delete('/record/:record_id', (req, res) => {
  const recordId = parseInt(req.params.record_id);
  
  if (!storage.records[recordId]) {
    return res.status(404).json({ error: 'Record not found' });
  }
  
  delete storage.records[recordId];
  
  res.json({ message: 'Record deleted successfully', id: recordId });
});

module.exports = router;