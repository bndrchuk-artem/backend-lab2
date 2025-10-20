const express = require('express');
const router = express.Router();
const storage = require('../data/storage.js');

router.get('/users', (req, res) => {
  const users = Object.values(storage.users);
  res.json({ users, count: users.length });
});

router.get('/user/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id);
  const user = storage.users[userId];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

module.exports = router;