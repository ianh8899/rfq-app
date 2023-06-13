//models/rfq
// Importing mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Defining the RFQ schema
const rfqSchema = new mongoose.Schema({
  name: {
    // Name of the RFQ
    type: String,
    required: true,
    unique: true,
  },
  contractStartDate: {
    // Start date for the contract in RFQ
    type: Date,
    required: true,
  },
  about: {
    // Details about the RFQ
    type: String,
    required: true,
  },
  annualVolume: {
    // Expected annual volume for the contract in RFQ
    type: Number,
    required: true,
  },
  contractLength: {
    // Length of the contract in RFQ
    type: Number,
    required: true,
  },
  status: {
    // Status of the RFQ - Open, Closed
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
  createdBy: {
    // User who created the RFQ
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Exporting the RFQ model to be used in other parts of the application
module.exports = mongoose.model("RFQ", rfqSchema);
