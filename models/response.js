//models/response.js
// Importing mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Defining the response schema
const responseSchema = new mongoose.Schema({
  rfq: {
    // ID of the RFQ this response is associated with
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFQ",
    required: true,
  },
  unitPrice: {
    // Price per unit for the RFQ
    type: Number,
    required: true,
  },
  investment: {
    // Investment value for the RFQ
    type: Number,
    required: true,
  },
  currency: {
    // The currency the response is using
    type: String,
    required: true,
  },
  comments: {
    // Any comments the responder has included
    type: String,
  },
  createdBy: {
    // User who created the response
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    // Status of the response - Pending, Accepted, Rejected
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

// Exporting the Response model to be used in other parts of the application
module.exports = mongoose.model("Response", responseSchema);
