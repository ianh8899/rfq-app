// routes/responseRoutes.js

// Import the necessary modules
const express = require("express");
const ResponseRoutes = require("../models/response");
const User = require("../models/user");
const RFQ = require("../models/rfq");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Define an endpoint for creating a new response
router.post("/", async (req, res) => {
  try {
    // Verify the token and get the user
    const token = req.header("Authorization").split(" ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verified._id);

    // Check if the user is a buyer, only non-buyers can create responses
    if (!user || user.buyer) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if a response already exists for the same RFQ from this user
    const existingResponse = await ResponseRoutes.findOne({
      rfq: req.body.rfq,
      createdBy: user._id,
    });
    if (existingResponse) {
      return res.status(400).json({
        message: "You have already submitted a response for this RFQ.",
      });
    }

    // Check if the RFQ exists and is open
    const rfq = await RFQ.findById(req.body.rfq);
    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    if (rfq.status === "Closed") {
      return res
        .status(400)
        .json({ message: "This RFQ is closed and cannot be responded to." });
    }

    // Create a new response and save it
    const newResponse = new ResponseRoutes({
      ...req.body,
      createdBy: user._id,
    });
    await newResponse.save();

    // Return the created response
    res.status(200).json(newResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define an endpoint to get all responses for a specific RFQ
router.get("/:rfq", async (req, res) => {
  try {
    const responses = await ResponseRoutes.find({ rfq: req.params.rfq });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Define an endpoint to delete a response
router.delete("/:id", async (req, res) => {
  try {
    // Verify the token and get the user
    const token = req.header("Authorization").split(" ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verified._id);

    // Only non-buyers can delete responses
    if (!user || user.buyer) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the response exists and belongs to the current user
    const response = await ResponseRoutes.findById(req.params.id);
    if (!response || response.createdBy.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "ResponseRoutes not found" });
    }

    // Delete the response
    await ResponseRoutes.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "ResponseRoutes deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Define an endpoint to update a response
router.put("/:id", async (req, res) => {
  try {
    // Verify the token and get the user
    const token = req.header("Authorization").split(" ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verified._id);

    // Check if the response exists
    const response = await ResponseRoutes.findById(req.params.id);
    if (!response) {
      return res.status(400).json({ message: "Response not found" });
    }

    // Check if the status is the only field being updated or if the response belongs to the current user
    const onlyStatusUpdate =
      Object.keys(req.body).length === 1 && req.body.status;
    if (
      (!user.buyer && onlyStatusUpdate) ||
      (!onlyStatusUpdate &&
        response.createdBy.toString() !== user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update the response
    Object.assign(response, req.body);
    await response.save();

    // Return the updated response
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Export the router
module.exports = router;
