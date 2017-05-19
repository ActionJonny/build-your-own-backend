const express = require('express');

const beers = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const checkAuth = require('./checkAuth');

beers.get('/beers', (request, response) => {
  const { category, style } = request.query;
  if (!category && !style) {
    database('beers').select()
    .then((allBeers) => {
      response.status(200).json(allBeers);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
  } else if (category) {
    database('categories').where(database.raw('LOWER("name")'), category.toLowerCase())
    .then((beerCategory) => {
      if (!beerCategory.length) {
        response.status(404).send({ error: 'No beers found for that category' });
      } else {
        const { id } = beerCategory[0];
        database('beers').where('cat_id', id).select()
        .then((beerList) => {
          response.status(200).json(beerList);
        });
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
  } else {
    database('styles').where(database.raw('LOWER("name")'), style.toLowerCase())
    .then((beerStyle) => {
      if (!beerStyle.length) {
        response.status(404).send({ error: 'No beers found for that style' });
      } else {
        const { id } = beerStyle[0];
        database('beers').where('style_id', id).select()
        .then((beerList) => {
          response.status(200).json(beerList);
        });
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
  }
});

beers.get('/beers/:id', (request, response) => {
  const { id } = request.params;
  database('beers').where('beer_id', id)
    .then((beer) => {
      if (!beer.length) {
        response.status(404).send({ error: 'Beer does not exist' });
      } else {
        response.status(200).json(beer);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

beers.post('/beers', checkAuth, (request, response) => {
  const expectedRequest = ['name', 'cat_id', 'style_id'];
  const isMissing = expectedRequest.every(param => request.body[param]);
  let beer = request.body;

  if (!isMissing) { return response.status(422).send({ error: 'Missing content from post' }); }

  database('beers').max('beer_id')
    .then((id) => {
      const beer_id = id[0].max += 1;
      beer = Object.assign({}, beer, { beer_id });
      database('beers').insert(beer, ['id', 'name', 'beer_id', 'cat_id', 'style_id'])
        .then((newBeer) => {
          response.status(201).json(...newBeer);
        })
        .catch((error) => {
          response.status(500).send({ error });
        });
    });
});

beers.delete('/beers/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('beers').where('beer_id', id).select()
    .then((data) => {
      if (!data.length) {
        response.status(404).send({ error: 'Invalid Beer ID' });
      } else {
        database('beers').where('beer_id', id).del()
        .then(() => {
          response.sendStatus(204);
        })
        .catch((error) => {
          response.status(500).send({ error });
        });
      }
    });
});

beers.put('/beers/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const expectedRequest = ['beer_id', 'name', 'cat_id', 'style_id', 'brewery_id'];
  const isMissing = expectedRequest.every(param => request.body[param]);
  const beer = request.body;

  if (!isMissing) { return response.status(422).send({ error: 'Missing content from put' }); }

  database('beers').where('beer_id', id).select()
    .then((data) => {
      if (!data.length) {
        response.status(404).send({ error: 'Invalid Beer ID' });
      } else {
        database('beers').where('beer_id', id)
        .update(beer, ['beer_id', 'name', 'cat_id', 'style_id', 'brewery_id'])
        .then((updatedBeer) => {
          response.status(200).send(...updatedBeer);
        })
        .catch((error) => {
          response.status(500).send({ error });
        });
      }
    });
});

module.exports = beers;