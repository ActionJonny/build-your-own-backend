const express = require('express');
const breweries = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

breweries.get('/breweries', (request, response) => {
  database('breweries').select()
    .then((breweries) => {
      response.status(200).json(breweries);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

breweries.get('/breweries/:id', (request, response) => {
  const { id } = request.params;
  database('breweries').where('id', id)
    .then((brewery) => {
      if (!brewery.length) {
        response.status(404).send({ error: 'Brewery does not exist' });
      } else {
        response.status(200).json(brewery);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

breweries.get('/breweries/:id/beers', (request, response) => {
  const { id } = request.params;
  database('beers').where('brewery_id', id).select()
    .then((styles) => {
      if (!styles.length) {
        response.status(404).send({ error: 'No beers found for this brewery' });
      } else {
        response.status(200).json(styles);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

module.exports = breweries;