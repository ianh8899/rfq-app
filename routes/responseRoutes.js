// routes/response.js

const express = require('express');
const Response = require('../models/response'); // replace this with the path to your Response model
const User = require('../models/user'); // replace this with the path to your User model
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create a new response
router.post('/', async (req, res) => {
    try {
        const token = req.header('auth-token');
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);
        if (!user || user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newResponse = new Response({ ...req.body, userId: user._id });
        await newResponse.save();
        res.status(200).json(newResponse);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all responses for a specific RFQ
router.get('/:rfqId', async (req, res) => {
    try {
        const responses = await Response.find({ rfqId: req.params.rfqId });
        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete a response
router.delete('/:id', async (req, res) => {
    try {
        const token = req.header('auth-token');
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);
        if (!user || user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const response = await Response.findById(req.params.id);
        if (!response || response.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Response not found' });
        }

        await Response.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Response deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
