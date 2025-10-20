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

router.post('/user', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const newUser = {
        id: storage.userIdCounter++,
        name: name
    };

    storage.users[newUser.id] = newUser;

    res.status(201).json(newUser);
});

router.delete('/user/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id);
  
  if (!storage.users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete storage.users[userId];
  
  res.json({ message: 'User deleted successfully', id: userId });
});

module.exports = router;