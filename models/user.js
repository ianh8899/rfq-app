//models/rfq
// Importing mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Defining the user schema
const userSchema = new mongoose.Schema({
  username: {
    // Username of the user
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    // Password of the user
    type: String,
    required: true,
  },
  buyer: {
    // Role of the user, if the user is a buyer
    type: Boolean,
    default: false,
  },
});

// Exporting the User model to be used in other parts of the application
module.exports = mongoose.model("User", userSchema);
