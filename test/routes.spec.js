const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
const server = require('../server/index');

chai.use(chaiHttp);

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run();
    })
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/categories', () => {
    console.log(process.env.TOKEN);
    it('should return a json object of all beer categories', (done) => {
      chai.request(server)
      .get('/api/v1/categories')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(11);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        done();
      });
    });

    it('should throw an error on a failed GET to /categories', (done) => {
      chai.request(server)
      .get('/api/v1/categoriessss')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Not Found' });
        done();
      });
    });
  });

  describe('GET /api/v1/styles', () => {
    it('should return a json object of all beer styles', (done) => {
      chai.request(server)
      .get('/api/v1/styles')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(141);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('category_id');
        done();
      });
    });

    it('should throw an error on a failed GET to /styles', (done) => {
      chai.request(server)
      .get('/api/v1/stylezzzzzz')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Not Found' });
        done();
      });
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    it('should return a single object when supplied with a valid category ID', (done) => {
      chai.request(server)
      .get('/api/v1/categories/5')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(1);
        response.body[0].name.should.equal('Belgian and French Ale');
        done();
      });
    });

    it('should return an error if a category can not be found', (done) => {
      chai.request(server)
      .get('/api/v1/categories/500')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Category does not exist' });
        done();
      });
    });
  });

  describe('GET /api/v1/styles/:id', () => {
    it('should return a single object when supplied with a valid style ID', (done) => {
      chai.request(server)
      .get('/api/v1/styles/50')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(1);
        response.body[0].name.should.equal('South German-Style Hefeweizen');
        done();
      });
    });

    it('should return an error if a style can not be found', (done) => {
      chai.request(server)
      .get('/api/v1/styles/5000')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Style does not exist' });
        done();
      });
    });
  });

  describe('GET /api/v1/categories/:id/styles', () => {
    it('should return a specific set of styles for a category', (done) => {
      chai.request(server)
      .get('/api/v1/categories/5/styles')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(16);
        response.body[0].category_id.should.equal(5);
        done();
      });
    });

    it('should return and error if no styles are found for the selected category', (done) => {
      chai.request(server)
      .get('/api/v1/categories/100/styles')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'No styles found for this category' });
        done();
      });
    });
  });

  describe('GET /api/v2/breweries', () => {
    it('should return a json object of all breweries', (done) => {
      chai.request(server)
      .get('/api/v2/breweries')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(1414);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('address1');
        response.body[0].should.have.property('city');
        response.body[0].should.have.property('state');
        response.body[0].should.have.property('code');
        response.body[0].should.have.property('country');
        done();
      });
    });

    it('should throw an error on a failed GET to /breweries', (done) => {
      chai.request(server)
      .get('/api/v2/breweriesssss')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Not Found' });
        done();
      });
    });
  });

  describe('GET /api/v2/beers', () => {
    it('should return a json object of all beers', (done) => {
      chai.request(server)
      .get('/api/v2/beers')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(500);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('cat_id');
        response.body[0].should.have.property('style_id');
        done();
      });
    });

    it('should throw an error on a failed GET to /beers', (done) => {
      chai.request(server)
      .get('/api/v2/beersssss')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Not Found' });
        done();
      });
    });
  });

  describe('GET /api/v2/beers/QUERY', () => {
    it('should return a json object of beers for a selected beer category', (done) => {
      chai.request(server)
      .get('/api/v2/beers?category=British%20Ale')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(25);
        response.body[0].cat_id.should.equal(1);
        done();
      });
    });

    it('should throw an error on a failed GET to /beers/QUERY for category', (done) => {
      chai.request(server)
      .get('/api/v2/beers?category=No%20Beer%20Here')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'No beers found for that category' });
        done();
      });
    });

    it('should return a json object of beers for a selected beer style', (done) => {
      chai.request(server)
      .get('/api/v2/beers?style=American-Style%20Pale%20Ale')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(45);
        response.body[0].style_id.should.equal(26);
        done();
      });
    });

    it('should throw an error on a failed GET to /beers/QUERY for style', (done) => {
      chai.request(server)
      .get('/api/v2/beers?style=No%20Style%20Here')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'No beers found for that style' });
        done();
      });
    });
  });

  describe('GET /api/v1/breweries/:id/beers', () => {
    it('should return a specific set of beers for a brewery', (done) => {
      chai.request(server)
      .get('/api/v2/breweries/14/beers')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(6);
        response.body[0].brewery_id.should.equal(14);
        done();
      });
    });

    it('should return an error if no beers are found for the selected brewery', (done) => {
      chai.request(server)
      .get('/api/v2/breweries/1000/beers')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'No beers found for this brewery' });
        done();
      });
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should be able to POST a new category to the categories database', (done) => {
      chai.request(server)
      .post('/api/v1/categories')
      .set('Authorization', process.env.TOKEN)
      .send({ name: 'Indian Pale Ales' })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.should.have.property('category_id');
        response.body.should.have.property('name');
        response.body.name.should.equal('Indian Pale Ales')
        done();
      });
    });

    it('should return an error if a POST request is made without in correct request data', (done) => {
      chai.request(server)
      .post('/api/v1/categories')
      .set('Authorization', process.env.TOKEN)
      .send({})
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from post' });
        done();
      });
    });
  });

});