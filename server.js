//server.js

// Import the necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');

// Import route handlers
const userRoutes = require('./routes/userRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const responseRoutes = require('./routes/responseRoutes');

// Import and configure dotenv for environment variables
require('dotenv').config();

// Establish a connection to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    // Log successful database connection
    console.log("Connected to DB successfully");
}).catch((error) => {
    // Log database connection failure
    console.log("Failed to connect to DB", error);
});

// Initialize Express app
const app = express();

// Use body-parser middleware to parse request bodies
app.use(express.json());
// Use cors middleware to allow cross-origin requests
app.use(cors());

// Establish a second connection to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Log a message when Mongoose successfully connects
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
    // Extract the Authorization header
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        // Extract the token from the Authorization header
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        // Verify the JWT token
        jwt.verify(req.token, process.env.TOKEN_SECRET, (err, authData) => {
            if(err) {
                // If token verification fails, return a 403 Forbidden status
                res.sendStatus(403);
            } else {
                // If token verification succeeds, add the decoded token to the request and call the next middleware
                req.authData = authData;
                next();
            }
        });
    } else {
        // If no Authorization header is present, return a 403 Forbidden status
        res.sendStatus(403);
    }
}

// Use imported routes with Express
app.use('/user', userRoutes);
app.use('/rfq', verifyToken, rfqRoutes);
app.use('/response', verifyToken, responseRoutes);

// Middleware for handling errors
app.use((err, req, res, next) => {
    // Log the error stacktrace
    console.error(err.stack);
    // Return a 500 status and error message
    res.status(500).send('Something broke!');
});

// Create a server with the Express app
const server = http.createServer(app);

// If the environment is not test, listen on the specified port
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server is starting at PORT: ${PORT}`));
}

// Export the server
module.exports = server;

