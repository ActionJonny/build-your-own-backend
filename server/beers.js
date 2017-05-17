const express = require('express');
const beers = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

beers.get('/beers', (request, response) => {
  const { category } = request.query;
  if(!category) {
    database('beers').select()
    .then((allBeers) => {
      response.status(200).json(allBeers);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
  } else {
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
  }
});

beers.get('/beers/:id', (request, response) => {
  const { id } = request.params;
  database('beers').where('id', id)
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


module.exports = beers;