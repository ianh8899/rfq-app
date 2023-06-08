//test/userRoutes.test.js
// Import necessary modules
const util = require('util');

// Some environments do not have TextEncoder and TextDecoder as a global object. This block of code checks whether TextEncoder or TextDecoder are defined, if not, it assigns them to the global scope.
if (typeof TextEncoder === "undefined") {
    global.TextEncoder = util.TextEncoder;
}
if (typeof TextDecoder === "undefined") {
    global.TextDecoder = util.TextDecoder;
}

// Import necessary modules for testing
let model = require('../models/rfq') // Rfq model
let mongoose = require('mongoose') // Mongoose for MongoDB interaction
let chai = require('chai') // Chai for assertion
let expect = chai.expect; // Expect function from chai for assertions
let request = require('request') // Request for making HTTP requests

// Describe a test suite for running the fetch request to MongoDB for all RFQs
describe('Running the fetch request to MongoDB for all RFQs', () => {
    it('should give a 403 message to indicate connected but access denied', (done) => {
        // Make a GET request to the specified endpoint
        request.get('http://localhost:5000/rfq/all', (req, response) => {
            console.log('response', response.statusCode) // Log the status code
            expect(response.statusCode).to.equal(403); // Expect the status code to be 403, indicating that connection was made and access is denied
            mongoose.disconnect(); // Disconnect from the MongoDB after the test case
            done() // Indicate that this test case is done
        })
    })
})