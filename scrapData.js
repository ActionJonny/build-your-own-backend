const beerStylesFile = './csv/styles.csv';
const beerCategoriesFile = './csv/categories.csv';
const csv = require('csvtojson');

csv().fromFile(beerStylesFile)
  .on('json', jsonObj => {
    console.log(jsonObj);
  })
  .on('done', err => {
    console.log(err);
  })

csv().fromFile(beerCategoriesFile)
  .on('json', jsonObj => {
    console.log(jsonObj);
  })
  .on('done', err => {
    console.log(err);
  })

