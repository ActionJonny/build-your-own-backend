const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;
const morgan = require('morgan');

const categories = require('./categories');
const styles = require('./styles');
const breweries = require('./breweries');
const beers = require('./beers');

if (!config.CLIENT_SECRET || !config.USERNAME || !config.PASSWORD) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file'
}
app.set('secretKey', config.CLIENT_SECRET);
const token = jwt.sign('token', app.get('secretKey'));
console.log(token);

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.params.token ||
                request.headers.authorization;
  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          messgae: 'Invalid authorization token',
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      messgae: 'You must be authorized to hit this end point',
    });
  }
};

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(checkAuth);
app.use('/api/v1', categories);
app.use('/api/v1', styles);
app.use('/api/v2', breweries);
app.use('/api/v2', beers);

app.get('/*', (request, response) => {
  response.status(404).send({ error: 'Not Found' });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Server is listening on ${(app.get('port'))}`);
  });
}

module.exports = app;