const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User, Currency } = require('../models');
const authMiddleware = require('../middleware/auth');

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  default_currency_id: Joi.number().integer().positive().required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const { name, username, password, default_currency_id } = value;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists' 
      });
    }

    const currency = await Currency.findByPk(default_currency_id);
    if (!currency) {
      return res.status(400).json({ 
        error: 'Invalid default_currency_id' 
      });
    }

    const newUser = await User.create({
      name,
      username,
      password,
      default_currency_id
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        default_currency_id: newUser.default_currency_id
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      throw error;
    }

    const { username, password } = value;

    const user = await User.findOne({ 
      where: { username },
      include: 'defaultCurrency'
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        default_currency_id: user.default_currency_id
      },
      access_token: token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;