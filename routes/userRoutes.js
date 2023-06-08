//routes/userRoutes.js
// Import necessary modules and initialize a new Express router
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Path to the User model
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
    // Check if the user already exists in the database
    const userExists = await User.findOne({username: req.body.username});
    if (userExists) return res.status(400).json('Username already exists');

    // Check if username and password are provided in the request
    if (!req.body.username || !req.body.password) return res.status(400).json('Username and password are required');

    // Check if the password length is within acceptable bounds
    if (req.body.password.length < 8 || req.body.password.length > 1024) return res.status(400).json('Password must be between 8 and 1024 characters');

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        buyer: false // All new users are suppliers by default
    });
    try {
        // Save the new user object to the database
        const savedUser = await user.save();
        // Respond with the ID of the new user
        res.send({ user: savedUser._id });
    } catch (err) {
        // If an error occurs, respond with the error
        res.status(400).json(err);
    }
});

// Route to log in a user
router.post('/login', async (req, res) => {
    try {
        // Try to find the user in the database
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            // If the user is not found, respond with an error message
            return res.status(400).json({ message: 'Company Name not Found, please double check spelling' });
        }

        // Check if the password in the request matches the password in the database
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).json({message: "Invalid password"});

        // If the password matches, create a new JWT token and include the user's ID and buyer status in the payload
        const token = jwt.sign({_id: user._id, buyer: user.buyer}, process.env.TOKEN_SECRET);
        // Respond with the token
        res.header('token', token).status(200).json({token});
    } catch (error) {
        // If an error occurs, respond with the error
        res.status(500).json(error);
    }
});

// Route to get a user by their ID
router.get('/:userId', async (req, res) => {
    try {
        // Try to find the user in the database
        const user = await User.findById(req.params.userId);
        if (!user) {
            // If the user is not found, respond with an error message
            return res.status(400).json({ message: 'User not found' });
        }

        // If the user is found, respond with the user
        res.json(user);
    } catch (error) {
        // If an error occurs, respond with the error
        res.status(500).json(error);
    }
});

// Export the router so it can be used in other parts of the application
module.exports = router;
