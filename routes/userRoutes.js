const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User, Currency } = require('../models');

// Схема валідації для створення юзера
const userCreateSchema = Joi.object({
  name: Joi.string().min(2).required(),
  default_currency_id: Joi.number().integer().positive().required()
});

// Схема валідації для оновлення валюти
const userCurrencySchema = Joi.object({
  default_currency_id: Joi.number().integer().positive().required()
});

// GET /users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({ include: 'defaultCurrency' });
    res.json({ users, count: users.length });
  } catch (err) {
    next(err);
  }
});

// GET /user/:user_id
router.get('/user/:user_id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.user_id, { include: 'defaultCurrency' });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /user
router.post('/user', async (req, res, next) => {
  try {
    const { error, value } = userCreateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    // Перевіряємо, чи існує валюта
    const currency = await Currency.findByPk(value.default_currency_id);
    if (!currency) {
      return res.status(400).json({ error: 'Invalid default_currency_id' });
    }

    const newUser = await User.create(value);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// DELETE /user/:user_id
router.delete('/user/:user_id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.user_id);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Міграція 'create-record' має 'onDelete: CASCADE',
    // тому всі пов'язані записи будуть видалені автоматично.
    await user.destroy();
    
    res.json({ message: 'User deleted successfully', id: userId });
  } catch (err) {
    next(err);
  }
});

// PATCH /user/:user_id/default-currency Встановити валюту за замовчуванням
router.patch('/user/:user_id/default-currency', async (req, res, next) => {
  try {
    const { error, value } = userCurrencySchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currency = await Currency.findByPk(value.default_currency_id);
    if (!currency) {
      return res.status(400).json({ error: 'Invalid default_currency_id' });
    }

    user.default_currency_id = value.default_currency_id;
    await user.save();
    
    const updatedUser = await User.findByPk(user.id, { include: 'defaultCurrency' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;