const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Record, User, Category, Currency } = require('../models');
const authMiddleware = require('../middleware/auth');

const recordSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  category_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  currency_id: Joi.number().integer().positive().optional()
});

router.get('/record/:record_id', authMiddleware, async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.record_id);
    const record = await Record.findByPk(recordId, {
      include: [
        { 
          model: User, 
          include: 'defaultCurrency',
          attributes: { exclude: ['password'] }
        }, 
        Category, 
        Currency
      ]
    });
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.get('/record', authMiddleware, async (req, res, next) => {
  try {
    const { user_id, category_id } = req.query;
    const where = {};

    if (user_id) where.user_id = parseInt(user_id);
    if (category_id) where.category_id = parseInt(category_id);

    if (!user_id && !category_id) {
      return res.status(400).json({ 
        error: 'At least one parameter (user_id or category_id) is required' 
      });
    }

    const records = await Record.findAll({ 
      where,
      include: [
        { 
          model: User, 
          include: 'defaultCurrency',
          attributes: { exclude: ['password'] }
        }, 
        Category, 
        Currency
      ]
    });
    
    res.json({ 
      records, 
      count: records.length,
      filters: { user_id, category_id }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/record', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = recordSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const { user_id, category_id, amount } = value;
    let currency_id = value.currency_id;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (!currency_id) {
      if (!user.default_currency_id) {
        return res.status(400).json({ 
          error: 'User has no default currency set and no currency_id was provided.' 
        });
      }
      currency_id = user.default_currency_id;
    } else {
      const currency = await Currency.findByPk(currency_id);
      if (!currency) {
        return res.status(400).json({ error: 'Invalid currency_id' });
      }
    }

    const newRecord = await Record.create({
      user_id,
      category_id,
      amount,
      currency_id
    });
    
    const result = await Record.findByPk(newRecord.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        }, 
        Category, 
        Currency
      ]
    });
    
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/record/:record_id', authMiddleware, async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.record_id);
    
    const record = await Record.findByPk(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.destroy();
    
    res.json({ message: 'Record deleted successfully', id: recordId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;