const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // replace this with the path to your User model
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    // Check if the user already exists
    const userExists = await User.findOne({username: req.body.username});
    if (userExists) return res.status(400).json('Username already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        buyer: false // As we said, all new users are suppliers by default
    });
    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // check password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).json({message: "Invalid password"});

        // Create and assign token, include buyer status in the payload
        const token = jwt.sign({_id: user._id, buyer: user.buyer}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).status(200).json({token});

    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;
