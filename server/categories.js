const express = require('express');
const categories = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

categories.get('/categories', (request, response) => {
  database('categories').select()
    .then((categories) => {
      response.status(200).json(categories);
    })
    .catch((error) => {
      console.error('error:', error);
    });
});

categories.get('/categories/:id', (request, response) => {
  const { id } = request.params;
  database('categories').where('id', id)
    .then((category) => {
      response.status(200).json(category);
    })
    .catch((error) => {
      console.error('error:', error);
    });
});

module.exports = categories;