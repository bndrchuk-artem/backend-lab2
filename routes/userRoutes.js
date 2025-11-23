const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User, Currency } = require('../models');
const authMiddleware = require('../middleware/auth');

const userCurrencySchema = Joi.object({
  default_currency_id: Joi.number().integer().positive().required()
});

router.get('/users', authMiddleware, async (req, res, next) => {
  try {
    const users = await User.findAll({ 
      include: 'defaultCurrency',
      attributes: { exclude: ['password'] }
    });
    res.json({ users, count: users.length });
  } catch (err) {
    next(err);
  }
});

router.get('/user/:user_id', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.user_id, { 
      include: 'defaultCurrency',
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/user/:user_id', authMiddleware, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.user_id);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    
    res.json({ message: 'User deleted successfully', id: userId });
  } catch (err) {
    next(err);
  }
});

router.patch('/user/:user_id/default-currency', authMiddleware, async (req, res, next) => {
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
    
    const updatedUser = await User.findByPk(user.id, { 
      include: 'defaultCurrency',
      attributes: { exclude: ['password'] }
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;