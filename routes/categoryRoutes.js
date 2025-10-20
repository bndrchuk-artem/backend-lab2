const express = require('express');
const router = express.Router();
const storage = require('../data/storage');

router.get('/category', (req, res) => {
  const categories = Object.values(storage.categories);
  res.json({ categories, count: categories.length });
});

router.post('/category', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  const newCategory = {
    id: storage.categoryIdCounter++,
    name: name
  };
  
  storage.categories[newCategory.id] = newCategory;
  
  res.status(201).json(newCategory);
});

router.delete('/category/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  
  if (!categoryId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }
  
  if (!storage.categories[categoryId]) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  delete storage.categories[categoryId];
  
  res.json({ message: 'Category deleted successfully', id: categoryId });
});

module.exports = router;