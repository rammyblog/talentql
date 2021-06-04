const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
const server = require('../server');

// Assertion Style
chai.should();
chai.use(chaiHttp);

// /Endpoint testing with mocha and chai and chai-http

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);

describe('Post Images API', () => {
  it('should Register user, login user, check token, POST an image on /api/posts-images/', (done) => {
    chai
      .request(server)
      // register request
      .post('/api/users/signup')
      // send user registration details
      .send({
        name: 'onasanyatunde1245@gmail.com',
        email: 'testerss@gmail.com',
        password: 'testers',
      })
      .end((err, res) => {
        // the res object should have a status of 201
        res.should.have.status(201);
        // follow up with login
        chai
          .request(server)
          .post('/api/users/login')
          // send user login details
          .send({
            email: 'testerss@gmail.com',
            password: 'testers',
          })
          .end((err, res) => {
            console.log('this runs the login part');
            res.body.should.have.property('token');
            let { token } = res.body;
            let imagePath = path.join(__dirname, 'file.jpg');

            chai
              .request(server)
              .post('/api/posts-images')
              .set('Authorization', `Bearer ${token}`)
              .set('content-type', 'multipart/form-data')
              .attach('images', imagePath)
              .end((err, res) => {
                console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('All files successfully uploaded');
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
