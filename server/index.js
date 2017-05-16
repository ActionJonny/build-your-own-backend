const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const categories = require('./categories');
const styles = require('./styles');

app.use(bodyParser.json())
app.use(morgan('dev'));

app.set('port', process.env.PORT || 3000);

app.use('/api/v1', categories);
app.use('/api/v1', styles);

app.listen(app.get('port'), () => {
  console.log(`Server is listening on ${(app.get('port'))}`);
});

module.exports = app;