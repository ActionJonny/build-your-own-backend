const express = require('express');
const beers = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

beers.get('/beers', (request, response) => {
  database('beers').select()
    .then((beers) => {
      response.status(200).json(beers);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
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