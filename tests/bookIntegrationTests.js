var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Book = mongoose.model('Book'),
    agent = request.agent(app);

describe('Book CRUD Test', function () {
    describe('when a book is POSTed', function () {

        it('should return read and _id fields', function (done) {
            var postedBook = {title: 'new Book', author: 'new Author', genre: 'Fiction'};

            agent.post('/api/books')
                .send(postedBook)
                .expect(200)
                .end(function (err, res) {
                    res.body.read.should.equal(false);
                    res.body.should.have.property('_id');
                    done();
                })
        });

        it('should be retrievable with a GET', function (done) {
            var postedBook = {title: 'test Book', author: 'test Author', genre: 'test Genre', read: true};

            var GetBook = function (id) {
                return agent.get('/api/books/' + id)
                    .expect(200)
                    .end(function (err, res) {
                        for(var key in bookPost) {
                            bookPost[key].should.equal(res.body[key]);
                        }
                    });
            };

            agent.post('/api/books')
                .send(postedBook)
                .expect(200)
                .end(function (err, res) {
                    var id = res.body._id;
                    GetBook(id);
                    
                    done();
                });
        });
    });

    afterEach(function (done) {
        Book.remove().exec();
        done();
    })
});