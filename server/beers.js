const express = require('express');
const beers = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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