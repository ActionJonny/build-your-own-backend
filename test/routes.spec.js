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
      .get('/api/v2/beers')
      .query({ category: 'British Ale' })
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
      .get('/api/v2/beers')
      .query({ category: 'No Beer Here' })
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
      .get('/api/v2/beers')
      .query({ style: 'American-Style Pale Ale' })
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
      .get('/api/v2/beers')
      .query({ style: 'No Styles Here' })
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

    it('should return an error if a POST request to categories is made without correct request data', (done) => {
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

  describe('POST /api/v1/styles', () => {
    it('should be able to POST a new style to the styles database', (done) => {
      chai.request(server)
      .post('/api/v1/styles')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'Traditional IPA',
        category_id: 10,
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.should.have.property('style_id');
        response.body.should.have.property('category_id');
        response.body.should.have.property('name');
        response.body.name.should.equal('Traditional IPA');
        response.body.category_id.should.equal(10);
        done();
      });
    });

    it('should return an error if a POST request to styles is made without correct request data', (done) => {
      chai.request(server)
      .post('/api/v1/styles')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'Traditional IPA',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from post' });
        done();
      });
    });
  });

  describe('POST /api/v2/breweries', () => {
    it('should be able to POST a new brewery to the breweries database', (done) => {
      chai.request(server)
      .post('/api/v2/breweries')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'Russian River',
        address1: '725 4th St',
        city: 'Santa Rosa',
        state: 'CA',
        code: '95404',
        country: 'United States',
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.should.have.property('brewery_id');
        response.body.should.have.property('name');
        response.body.should.have.property('address1');
        response.body.should.have.property('city');
        response.body.should.have.property('state');
        response.body.should.have.property('code');
        response.body.should.have.property('country');
        response.body.name.should.equal('Russian River');
        response.body.city.should.equal('Santa Rosa');
        response.body.state.should.equal('CA');
        done();
      });
    });

    it('should return an error if a POST request to breweries is made without correct request data', (done) => {
      chai.request(server)
      .post('/api/v2/breweries')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'Ballast Point',
        city: 'Temecula',
        state: 'CA',
        code: '92121',
        country: 'United States',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from post' });
        done();
      });
    });
  });

  describe('POST /api/v2/beers', () => {
    it('should be able to POST a new beers to the beers database', (done) => {
      chai.request(server)
      .post('/api/v2/beers')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'Pliny the Elder',
        cat_id: 10,
        style_id: 31,
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.should.have.property('beer_id');
        response.body.should.have.property('cat_id');
        response.body.should.have.property('style_id');
        response.body.name.should.equal('Pliny the Elder');
        response.body.cat_id.should.equal(10);
        response.body.style_id.should.equal(31);
        done();
      });
    });

    it('should return an error if a POST request to beers is made without correct request data', (done) => {
      chai.request(server)
      .post('/api/v2/beers')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: '2x4',
        cat_id: 10,
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from post' });
        done();
      });
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should be able to DELETE a specific category', (done) => {
      chai.request(server)
      .get('/api/v1/categories')
      .set('Authorization', process.env.TOKEN)
      .end((err, response) => {
        response.body.length.should.equal(11);
        chai.request(server)
        .delete('/api/v1/categories/11')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/categories')
          .set('Authorization', process.env.TOKEN)
          .end((err, response) => {
            response.body.length.should.equal(10);
            done();
          });
        });
      });
    });
  });

  it('should respond with a 404 warning if a DELETE is attempted without correct params', (done) => {
    chai.request(server)
    .delete('/api/v1/categories/')
    .set('Authorization', process.env.TOKEN)
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

});