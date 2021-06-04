/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../models/User');
const server = require('../server');

// Assertion Style
chai.should();
chai.use(chaiHttp);

// The email delays the test sometimes, causing it to fail
describe('AUTH API', () => {
  // Test the registration api
  describe('POST /api/users/signup', () => {
    it('It should register a user', (done) => {
      const registrationData = {
        name: 'onasanyatunde1245@gmail.com',
        email: 'testerss@gmail.com',
        password: 'testers',
      };
      chai
        .request(server)
        .post('/api/users/signup')
        .send(registrationData)
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    });
  });

  describe('POST /api/users/signup', () => {
    it('It should {not register} a user', (done) => {
      const registrationData = {
        name: 'Onasanya tunde',
        password: 'testing',
      };
      chai
        .request(server)
        .post('/api/users/signup')
        .send(registrationData)
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  //   User login
  // Having issues with the model object User.matchPasswords, don't know what to do
  describe('POST /api/users/login', () => {
    it('It should login a user', (done) => {
      const loginData = {
        email: 'testerss@gmail.com',
        password: 'testers',
      };
      const registrationData = {
        name: 'onasanyatunde1245@gmail.com',
        email: 'testerss@gmail.com',
        password: 'testers',
      };
      chai
        .request(server)
        .post('/api/users/signup')
        .send(registrationData)
        .end((err, response) => {
          response.should.have.status(201);
          chai
            .request(server)
            .post('/api/users/login')
            .send(loginData)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.should.have.property('token');
              done();
            });
        });
    });
  });

  afterEach((done) => {
    User.findOneAndDelete({ email: 'testerss@gmail.com' }).exec();
    done();
  });
  after((done) => {
    mongoose.connection.close();
    server.close(done());
    // done();
  });
});
