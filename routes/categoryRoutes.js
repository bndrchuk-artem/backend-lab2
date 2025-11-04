const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Category } = require('../models');

// Схема валідації
const categorySchema = Joi.object({
  name: Joi.string().min(2).required()
});

// GET /category Отримати всі категорії
router.get('/category', async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories, count: categories.length });
  } catch (err) {
    next(err);
  }
});

// POST /category Створити нову категорію
router.post('/category', async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const newCategory = await Category.create(value);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

// DELETE /category/:id Видалити категорію
router.delete('/category/:id', async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Міграція 'create-record' має 'onDelete: CASCADE',
    // тому всі пов'язані записи будуть видалені автоматично.
    await category.destroy();

    res.json({ message: 'Category deleted successfully', id: categoryId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;