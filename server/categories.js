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
      response.status(500).send({ error });
    });
});

categories.get('/categories/:id', (request, response) => {
  const { id } = request.params;
  database('categories').where('id', id)
    .then((category) => {
      if (!category.length) {
        response.status(404).send({ error: 'Category does not exist' });
      } else {
        response.status(200).json(category);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

categories.get('/categories/:id/styles', (request, response) => {
  const { id } = request.params;
  database('styles').where('category_id', id).select()
    .then((styles) => {
      if (!styles.length) {
        response.status(404).send({ error: 'No styles found for this category' });
      } else {
        response.status(200).json(styles);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

module.exports = categories;