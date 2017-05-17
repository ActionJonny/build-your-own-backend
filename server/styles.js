const express = require('express');
const styles = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

styles.get('/styles', (request, response) => {
  database('styles').select()
    .then((styles) => {
      response.status(200).json(styles);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

styles.get('/styles/:id', (request, response) => {
  const { id } = request.params;
  database('styles').where('id', id)
    .then((style) => {
      if (!style.length) {
        response.status(404).send({ error: 'Style does not exist' });
      } else {
        response.status(200).json(style);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

module.exports = styles;