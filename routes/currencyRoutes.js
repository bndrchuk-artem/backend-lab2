const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Currency } = require('../models');
const authMiddleware = require('../middleware/auth');

const currencySchema = Joi.object({
  code: Joi.string().length(3).uppercase().required(),
  name: Joi.string().min(3).required()
});

router.get('/currency', authMiddleware, async (req, res, next) => {
  try {
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (err) {
    next(err);
  }
});

router.post('/currency', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = currencySchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const newCurrency = await Currency.create(value);
    res.status(201).json(newCurrency);
  } catch (err) {
    next(err);
  }
});

router.delete('/currency/:id', authMiddleware, async (req, res, next) => {
  try {
    const currencyId = parseInt(req.params.id);
    const currency = await Currency.findByPk(currencyId);
    
    if (!currency) {
      return res.status(404).json({ error: 'Currency not found' });
    }

    await currency.destroy();
    res.json({ message: 'Currency deleted successfully', id: currencyId });

  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Cannot delete currency. It is still referenced by users or records.' 
      });
    }
    next(err);
  }
});

module.exports = router;