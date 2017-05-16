const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server is listening on ${(app.get('port'))}`);
});

app.get('/api/v1/categories', (request, response) => {
  database('categories').select()
    .then((categories) => {
      response.status(200).json(categories);
    })
    .catch((error) => {
      console.error('error:', error);
    });
});

app.get('/api/v1/styles', (request, response) => {
  database('styles').select()
    .then((styles) => {
      response.status(200).json(styles);
    })
    .catch((error) => {
      console.error('error:', error);
    });
});

module.exports = app;