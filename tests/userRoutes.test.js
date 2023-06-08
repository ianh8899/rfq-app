//test/userRoutes.temptest.js

const util = require('util');
if (typeof TextEncoder === "undefined") {
    globalThis.TextEncoder = util.TextEncoder;
}
if (typeof TextDecoder === "undefined") {
    globalThis.TextDecoder = util.TextDecoder;
}

const User = require('../models/user')
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const http = require('http');
const should = chai.should();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { expect } = require('chai');


let httpServer = null;
const httpPort = 5000;

describe('User Routes', function () {
    beforeAll(function(done) {
        // Start server before running tests
        httpServer = http.createServer(server);
        httpServer.listen(httpPort, done);
    });

    afterAll(async function(done) {
        // Stop server after running tests
        httpServer.close(() => {
            mongoose.connection.close(() => {
                console.log("Closed the DB connection");
                done();
            });
        });
    }, 30000); // increase to 30 seconds

    let testUser = {
        username: 'testuser',
        password: 'testpassword',
        buyer: false
    }

    // Delete test user before each test
    beforeEach(async function() {
        // Delete test user before creating a new one
        await User.deleteMany({ username: 'testuser' });
        testUser = new User({
            username: 'testuser',
            password: await bcrypt.hash('testpassword', 10),
            buyer: false
        });
        await testUser.save();
    });

    afterEach(async function() {
        // Delete test user after each test
        await User.deleteMany({ username: 'testuser' }); // Adjusted
    });


    describe('/POST Register', function () {
        it('should not POST a register with a password length less than 8 or greater than 1024', function (done) {
            let user = {
                username: 'testuser',
                password: 'short' // or a string longer than 1024 characters
            }
            chai.request(httpServer)
                .post('/user/register')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (res) {
                        res.should.have.status(400); // Use chai assertion
                        res.body.should.be.a('string'); // Use chai assertion
                        res.body.should.equal('Password must be between 8 and 1024 characters'); // Use chai assertion
                    }
                    else {
                        throw new Error('Response is undefined');
                    }
                    done();
                });

        }, 30000);
    });

    /*

    // POST Login tests
    it('should POST a login', function (done) {
        const loginData = {
            username: 'testuser',
            password: 'testpassword'
        };
        chai.request(httpServer) // Change here
            .post('/user/login')
            .send(loginData)
            .end(async function (err, res) { // Add async here
                if (err) {
                    return done(err);
                }
                try {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    }, 15000); // Moved timeout here


    describe('/GET User', function () {
        it('should GET a user by the given id', function (done) {
            const user = new User({
                username: 'username',
                password: bcrypt.hashSync('password', 10),
                buyer: false
            });
            user.save()
                .then(user => {
                    chai.request(httpServer) // Change here
                        .get('/user/' + user.id)
                        .end(function (err, res) { // Remove .send(user) here
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('username');
                            res.body.should.have.property('buyer');
                            res.body.should.have.property('_id').eql(user.id.toString());
                            done();
                        });
                });
        });
    });

     */
});
