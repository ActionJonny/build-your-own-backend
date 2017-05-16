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
      console.error('error:', error);
    });
});

styles.get('/styles/:id', (request, response) => {
  const { id } = request.params;
  database('styles').where('id', id)
    .then((style) => {
      response.status(200).json(style);
    })
    .catch((error) => {
      console.error('error:', error);
    });
});

module.exports = styles;