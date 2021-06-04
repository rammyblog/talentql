const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const server = require('../server');
// Assertion Style
chai.should();
chai.use(chaiHttp);

// /Endpoint testing with mocha and chai and chai-http

// use chaiHttp for making the actual HTTP requests
chai.use(chaiHttp);

describe('Post API', () => {
  it('should Register user, login user, check token, upload an image, create a post on api/posts/ POST', (done) => {
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
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('All files successfully uploaded');

                let imageId = res.body.data[0]._id;

                chai
                  .request(server)
                  .post('/api/posts')
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    content: 'Hello world from talent ql test',
                    imageIds: [imageId],
                  })
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have
                      .property('message')
                      .eql('Post created successfully');
                    res.body.data.should.have
                      .property('content')
                      .eql('Hello world from talent ql test');
                    res.body.data.images[0]._id.should.equal(imageId);
                    done();
                  });
              });
          });
      });
  });
  it('should Register user, login user, check token, create a post on api/posts/ POST then GET the post on api/posts/:id', (done) => {
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
            chai
              .request(server)
              .post('/api/posts')
              .set('Authorization', `Bearer ${token}`)
              .send({
                content: 'Hello world from talent ql test',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('Post created successfully');
                res.body.data.should.have
                  .property('content')
                  .eql('Hello world from talent ql test');
                chai
                  .request(server)
                  .get(`/api/posts/${res.body.data._id}`)

                  // we set the auth header with our token
                  .set('Authorization', `Bearer ${token}`)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have
                      .property('message')
                      .eql('Post retrieved successfully');
                    res.body.data.should.have
                      .property('content')
                      .eql('Hello world from talent ql test');
                    done();
                  });
              });
          });
      });
  });

  it('should Register user, login user, check token, create a post on api/posts/ POST then PATCH the post on api/posts/:id', (done) => {
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
            chai
              .request(server)
              .post('/api/posts')
              .set('Authorization', `Bearer ${token}`)
              .send({
                content: 'Hello world from talent ql test',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('Post created successfully');
                res.body.data.should.have
                  .property('content')
                  .eql('Hello world from talent ql test');
                chai
                  .request(server)
                  .patch(`/api/posts/${res.body.data._id}`)
                  // we set the auth header with our token
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    content: 'Hello world from talent ql tests',
                  })
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have
                      .property('message')
                      .eql('Edited success');
                    res.body.data.should.have
                      .property('content')
                      .eql('Hello world from talent ql tests');
                    done();
                  });
              });
          });
      });
  });

  it('should Register user, login user, check token, create a post on api/posts/ POST then DELETE the post on api/posts/:id', (done) => {
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
            chai
              .request(server)
              .post('/api/posts')
              .set('Authorization', `Bearer ${token}`)
              .send({
                content: 'Hello world from talent ql test',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('Post created successfully');
                res.body.data.should.have
                  .property('content')
                  .eql('Hello world from talent ql test');
                var deletedPostId = res.body.data._id;
                chai
                  .request(server)
                  .delete(`/api/posts/${deletedPostId}`)

                  // we set the auth header with our token
                  .set('Authorization', `Bearer ${token}`)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have
                      .property('message')
                      .eql('Deleted success');
                    chai
                      .request(server)
                      .get(`/api/posts/${deletedPostId}`)

                      // we set the auth header with our token
                      .set('Authorization', `Bearer ${token}`)
                      .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have
                          .property('error')
                          .eql('Post with that ID not found');

                        done();
                      });
                  });
              });
          });
      });
  });
  afterEach((done) => {
    User.findOneAndDelete({ email: 'testerss@gmail.com' }).exec();
    Post.findOneAndDelete({
      content: 'Hello world from talent ql test',
    }).exec();
    Post.findOneAndDelete({
      content: 'Hello world from talent ql tests',
    }).exec();
    done();
  });
  after((done) => {
    mongoose.connection.close();
    server.close(done());
    // done();
  });
});
