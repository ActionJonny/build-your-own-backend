const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

const configuration = require('../knexfile').test;
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
        response.body.name.should.equal('Indian Pale Ales');
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
      .end((error, response) => {
        response.body.length.should.equal(11);
        chai.request(server)
        .delete('/api/v1/categories/11')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/categories')
          .set('Authorization', process.env.TOKEN)
          .end((error, response) => {
            response.body.length.should.equal(10);
            done();
          });
        });
      });
    });

    it('should respond with a 404 warning if a DELETE is attempted without correct params', (done) => {
      chai.request(server)
      .delete('/api/v1/categories/12')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Category ID' });
        done();
      });
    });
  });

  describe('DELETE /api/v2/beers/:id', () => {
    it('should be able to DELETE a specific beer', (done) => {
      chai.request(server)
      .get('/api/v2/beers')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.body.length.should.equal(500);
        chai.request(server)
        .delete('/api/v2/beers/111')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v2/beers')
          .set('Authorization', process.env.TOKEN)
          .end((error, response) => {
            response.body.length.should.equal(499);
            done();
          });
        });
      });
    });

    it('should respond with a 404 warning if a DELETE is attempted without correct params', (done) => {
      chai.request(server)
      .delete('/api/v2/beers/1000')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Beer ID' });
        done();
      });
    });
  });

  describe('PATCH /api/v2/breweries/:id', () => {
    it('should be able to PATCH a specific brewery', (done) => {
      chai.request(server)
      .get('/api/v2/breweries')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.body[0].name.should.equal('(512) Brewing Company');
        response.body[0].address1.should.equal('407 Radam, F200');
        response.body[0].city.should.equal('Austin');
        response.body[0].state.should.equal('Texas');
        response.body[0].code.should.equal('78745');
        response.body[0].country.should.equal('United States');
        chai.request(server)
        .patch('/api/v2/breweries/1')
        .set('Authorization', process.env.TOKEN)
        .send({
          name: 'New Brewery Name',
          address1: 'New Address',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.name.should.equal('New Brewery Name');
          response.body.address1.should.equal('New Address');
          response.body.city.should.equal('Austin');
          response.body.state.should.equal('Texas');
          response.body.code.should.equal('78745');
          response.body.country.should.equal('United States');
          done();
        });
      });
    });

    it('should respond with a 422 warning if a PATCH is attempted without correct params', (done) => {
      chai.request(server)
      .patch('/api/v2/breweries/1')
      .set('Authorization', process.env.TOKEN)
      .send({
        invaildKey: 'This won\'t work Brewery',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.deep.equal({ error: 'Missing content from patch' });
        done();
      });
    });

    it('should respond with a 404 warning if a PATCH is attempted with an incorrect Brewery ID', (done) => {
      chai.request(server)
      .patch('/api/v2/breweries/10000')
      .set('Authorization', process.env.TOKEN)
      .send({
        state: 'Colorado',
      })
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Brewery ID' });
        done();
      });
    });

    it('should respond with an error if a PATCH attempts to add a brewery_id that already exists', (done) => {
      chai.request(server)
      .patch('/api/v2/breweries/1')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'New Brewery Name',
        address1: 'New Brewery Address',
        brewery_id: 97,
      })
      .end((error, response) => {
        response.should.have.status(500);
        response.body.error.name.should.equal('error');
        response.body.error.detail.should.equal('Key (brewery_id)=(97) already exists.');
        done();
      });
    });
  });

  describe('PATCH /api/v1/styles/:id', () => {
    it('should be able to PATCH a specific beer style', (done) => {
      chai.request(server)
      .get('/api/v1/styles')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.body[0].name.should.equal('Classic English-Style Pale Ale');
        response.body[0].style_id.should.equal(1);
        response.body[0].category_id.should.equal(1);
        chai.request(server)
        .patch('/api/v1/styles/1')
        .set('Authorization', process.env.TOKEN)
        .send({
          name: 'New Classic Style of Pale Ale',
          category_id: 11,
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.name.should.equal('New Classic Style of Pale Ale');
          response.body.style_id.should.equal(1);
          response.body.category_id.should.equal(11);
          done();
        });
      });
    });

    it('should respond with a 422 warning if a PATCH is attempted without correct params', (done) => {
      chai.request(server)
      .patch('/api/v1/styles/90')
      .set('Authorization', process.env.TOKEN)
      .send({
        invaildKey: 'This style will not work',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.deep.equal({ error: 'Missing content from patch' });
        done();
      });
    });

    it('should respond with a 404 warning if a PATCH is attempted with an incorrect Beer Style ID', (done) => {
      chai.request(server)
      .patch('/api/v1/styles/500')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'New Classic Style of Pale Ale',
        style_id: 11,
      })
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Beer Style ID' });
        done();
      });
    });

    it('should respond with an error if a PATCH attempts to add a style_id that already exists', (done) => {
      chai.request(server)
      .patch('/api/v1/styles/1')
      .set('Authorization', process.env.TOKEN)
      .send({
        name: 'New Classic Style of Pale Ale',
        style_id: 11,
      })
      .end((error, response) => {
        response.should.have.status(500);
        response.body.error.name.should.equal('error');
        response.body.error.detail.should.equal('Key (style_id)=(11) already exists.');
        done();
      });
    });
  });

  describe('PUT /api/v2/beers/:id', () => {
    it('should be able to PUT a specific beer', (done) => {
      chai.request(server)
      .get('/api/v2/beers')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.body[0].beer_id.should.equal(1);
        response.body[0].name.should.equal('Hocus Pocus');
        response.body[0].cat_id.should.equal(11);
        response.body[0].style_id.should.equal(116);
        response.body[0].brewery_id.should.equal(812);
        chai.request(server)
        .put('/api/v2/beers/1')
        .set('Authorization', process.env.TOKEN)
        .send({
          beer_id: 1,
          name: 'New Beer Name',
          cat_id: 5,
          style_id: 2,
          brewery_id: 5,
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.beer_id.should.equal(1);
          response.body.name.should.equal('New Beer Name');
          response.body.cat_id.should.equal(5);
          response.body.style_id.should.equal(2);
          response.body.brewery_id.should.equal(5);
          done();
        });
      });
    });

    it('should respond with a 422 warning if a PUT is attempted without correct params', (done) => {
      chai.request(server)
      .put('/api/v2/beers/32')
      .set('Authorization', process.env.TOKEN)
      .send({
        beer_id: 32,
        cat_id: 2,
        style_id: 345,
        brewery_id: 20,
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.deep.equal({ error: 'Missing content from put' });
        done();
      });
    });

    it('should respond with a 404 warning if a PUT is attempted with an incorrect Beer ID', (done) => {
      chai.request(server)
      .put('/api/v2/beers/52111')
      .set('Authorization', process.env.TOKEN)
      .send({
        beer_id: 52111,
        name: 'New Beer Name',
        cat_id: 9,
        style_id: 45,
        brewery_id: 14,
      })
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Beer ID' });
        done();
      });
    });

    it('should respond with an error if a PUT attempts to add a beer_id that already exists', (done) => {
      chai.request(server)
      .put('/api/v2/beers/1')
      .set('Authorization', process.env.TOKEN)
      .send({
        beer_id: 10,
        name: 'New Beer Name',
        cat_id: 3,
        style_id: 452,
        brewery_id: 534,
      })
      .end((error, response) => {
        response.should.have.status(500);
        response.body.error.name.should.equal('error');
        response.body.error.detail.should.equal('Key (beer_id)=(10) already exists.');
        done();
      });
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should be able to PUT a specific category', (done) => {
      chai.request(server)
      .get('/api/v1/categories')
      .set('Authorization', process.env.TOKEN)
      .end((error, response) => {
        response.body[0].category_id.should.equal(1);
        response.body[0].name.should.equal('British Ale');
        chai.request(server)
        .put('/api/v1/categories/1')
        .set('Authorization', process.env.TOKEN)
        .send({
          category_id: 1,
          name: 'New Category Name',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.category_id.should.equal(1);
          response.body.name.should.equal('New Category Name');
          done();
        });
      });
    });

    it('should respond with a 422 warning if a PUT is attempted without correct params', (done) => {
      chai.request(server)
      .put('/api/v1/categories/5')
      .set('Authorization', process.env.TOKEN)
      .send({
        category_id: 5,
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.deep.equal({ error: 'Missing content from put' });
        done();
      });
    });

    it('should respond with a 404 warning if a PUT is attempted with an incorrect Category ID', (done) => {
      chai.request(server)
      .put('/api/v1/categories/500')
      .set('Authorization', process.env.TOKEN)
      .send({
        category_id: 500,
        name: 'New Category Name',
      })
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.deep.equal({ error: 'Invalid Category ID' });
        done();
      });
    });

    it('should respond with an error if a PUT attempts to add a category_id that already exists', (done) => {
      chai.request(server)
      .put('/api/v1/categories/1')
      .set('Authorization', process.env.TOKEN)
      .send({
        category_id: 6,
        name: 'New Category Name',
      })
      .end((error, response) => {
        response.should.have.status(500);
        response.body.error.name.should.equal('error');
        response.body.error.detail.should.equal('Key (category_id)=(6) already exists.');
        done();
      });
    });
  });
});

