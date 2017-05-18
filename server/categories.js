const express = require('express');
const categories = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

categories.get('/categories', (request, response) => {
  database('categories').select()
    .then((allCategories) => {
      response.status(200).json(allCategories);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

categories.get('/categories/:id', (request, response) => {
  const { id } = request.params;
  database('categories').where('category_id', id)
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

categories.post('/categories', (request, response) => {
  const { name } = request.body;
  if (!name) { return response.status(422).send({ error: 'Missing content from post' }); }

  database('categories').max('category_id')
    .then((id) => {
      const category_id = id[0].max += 1;
      database('categories').insert({ name, category_id }, ['id', 'category_id', 'name'])
        .then((category) => {
          response.status(201).json(...category);
        })
        .catch((error) => {
          response.status(500).send({ error });
        });
    });
});

categories.delete('/categories/:id', (request, response) => {
  const { id } = request.params;
  if (!id) { return response.status(422).send({ error: 'Missing category id from delete' }); }

  database('beers').where('cat_id', id)
    .update({ cat_id: null })
      .then(() => {
        return database('categories').where('category_id', id).del();
      })
      .then(() => {
        response.sendStatus(204);
      })
      .catch((error) => {
        response.status(500).send({ error });
      });
});

module.exports = categories;