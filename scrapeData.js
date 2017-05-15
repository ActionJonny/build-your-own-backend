const fs = require('fs');
const csv = require('csvtojson');

const beerStylesFile = './csv/styles.csv';
const beerCategoriesFile = './csv/categories.csv';

const writeToFile = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Successful Write to ./test.txt');
    }
  });
};

csv().fromFile(beerStylesFile)
  .on('end_parsed', jsonArrObj =>
    writeToFile('./writeData/styles.txt', jsonArrObj),
  )
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });

csv().fromFile(beerCategoriesFile)
  .on('end_parsed', jsonArrObj =>
    writeToFile('./writeData/categories.txt', jsonArrObj),
  )
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });
