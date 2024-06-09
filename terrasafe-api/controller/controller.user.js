// controllers/userController.js
const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { username, location } = req.body;
        const user = await User.create({ username, location });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};
