// routes/rfq.js

const express = require('express');
const RFQ = require('../models/rfq'); // replace this with the path to your RFQ model
const User = require('../models/user'); // replace this with the path to your User model
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create a new RFQ
router.post('/', async (req, res) => {
    try {
        const token = req.header('auth-token');
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);
        if (!user || !user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newRFQ = new RFQ(req.body);
        await newRFQ.save();
        res.status(200).json(newRFQ);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all RFQs
router.get('/', async (req, res) => {
    try {
        const rfqs = await RFQ.find({});
        res.status(200).json(rfqs);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update RFQ status or details
router.put('/:id', async (req, res) => {
    try {
        const token = req.header('auth-token');
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);
        if (!user || !user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const rfq = await RFQ.findById(req.params.id);
        if (!rfq) {
            return res.status(400).json({ message: 'RFQ not found' });
        }
        Object.assign(rfq, req.body);
        await rfq.save();
        res.status(200).json(rfq);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
