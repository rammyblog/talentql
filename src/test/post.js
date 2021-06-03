const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
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
              .attach('images', fs.readFileSync(imagePath))
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have
                  .property('message')
                  .eql('All files successfully uploaded');
                console.log(res.body);
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
                    done();
                    // chai
                    //   .request(server)
                    //   .delete(`/todo/${res.body[0]._id}`)

                    //   // we set the auth header with our token
                    //   .set('Authorization', `Bearer ${token}`)
                    //   .end((error, response) => {
                    //     response.should.have.status(200);
                    //     response.body.should.have.property('message');
                    //     response.body.message.should.equal(
                    //       'Authorized User, Action Successful!'
                    //     );
                    //     done();
                    //   });
                  });
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

// describe('/POST file', () => {
//   it('Should POST a file', (done) => {
//     console.log(`${__dirname}/file.png`);
//     chai
//       .request(server)
//       .post('/api/post-images')
//       .set('content-type', 'multipart/form-data')
//       .attach(
//         'images',
//         fs.readFileSync(`${__dirname}/file.png`),
//         'tests/file.png'
//       )
//       .send(file)
//       .end((err, res) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.should.have.property('data').eql('File Uploaded');
//         }
//         done();
//       });
//   });
// });
