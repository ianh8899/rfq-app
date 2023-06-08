// routes/rfqRoutes.js
// Import necessary modules and initiate a new Express router
const express = require('express');
const RfqRoutes = require('../models/rfq'); // Path to the RFQ model
const User = require('../models/user'); // Path to the User model
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route to get all RFQs for suppliers to view
router.get('/all', async (req, res) => {
    try {
        // Look for the user with the ID provided in the authData
        const user = await User.findById(req.authData._id);

        // If the user is not found or if the user is not a supplier, deny access
        if (!user || user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Retrieve all RFQs
        const rfqs = await RfqRoutes.find({});
        // Respond with the list of all RFQs
        res.status(200).json(rfqs);
    } catch (error) {
        // If an error occurs, pass the error to the next middleware
        next(error);
    }
});

// Route to get a specific RFQ by its ID
router.get('/:id', async (req, res, next) => {
    try {
        // Look for the RFQ with the given ID
        const rfq = await RfqRoutes.findById(req.params.id);
        // If the RFQ is not found, respond with an error
        if (!rfq) {
            return res.status(404).json({ message: 'RFQ not found' });
        }
        // Respond with the found RFQ
        res.status(200).json(rfq);
    } catch (error) {
        // If an error occurs, pass the error to the next middleware
        next(error);
    }
});

// Route to create a new RFQ
router.post('/', async (req, res) => {
    try {
        // Look for the user with the ID provided in the authData
        const user = await User.findById(req.authData._id);
        // If the user is not found, respond with an error
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        // If the user is not a buyer, deny access
        if (!user.buyer) {
            return res.status(403).json({ message: 'Access denied, not a buyer' });
        }

        // Create a new RFQ with the data in the request body and the ID of the user who created it
        const newRFQ = new RfqRoutes({
            ...req.body,
            createdBy: user._id, // add createdBy field here
        });

        // Save the new RFQ to the database
        await newRFQ.save();
        // Respond with the new RFQ
        res.status(200).json(newRFQ);
    } catch (error) {
        // If an error occurs, log the error and pass it to the next middleware
        console.log('Error:', error);
        next(error);
    }
});

// Route to get all RFQs created by the authenticated user
router.get('/', async (req, res) => {
    try {
        // Look for the user with the ID provided in the authData
        const user = await User.findById(req.authData._id);
        // If the user is not found, respond with an error
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Retrieve all RFQs created by the authenticated user
        const rfqs = await RfqRoutes.find({ createdBy: user._id });
        // Respond with the list of RFQs
        res.status(200).json(rfqs);
    } catch (error) {
        // If an error occurs, pass the error to the next middleware
        next(error);
    }
});

// Route to update the status or details of an RFQ
router.put('/:id', async (req, res) => {
    try {
        // Verify the JWT token and get the authenticated user's data
        const token = req.header('Authorization');
        const verified = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);
        // If the user is not found or if the user is not a buyer, deny access
        if (!user || !user.buyer) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Look for the RFQ with the given ID
        const rfq = await RfqRoutes.findById(req.params.id);
        // If the RFQ is not found, respond with an error
        if (!rfq) {
            return res.status(400).json({ message: 'RfqRoutes not found' });
        }

        // Merge the data in the request body into the RFQ
        Object.assign(rfq, req.body);
        // Save the updated RFQ to the database
        await rfq.save();
        // Respond with the updated RFQ
        res.status(200).json(rfq);
    } catch (error) {
        // If an error occurs, log the error and respond with an error message
        console.log(error);
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
});

// Export the router
module.exports = router;