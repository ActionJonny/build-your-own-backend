const fs = require('fs');
const csv = require('csvtojson');

const beerStylesFile = './csv/styles.csv';
const beerCategoriesFile = './csv/categories.csv';
const beersFile = './csv/beers.csv';
const breweriesFile = './csv/breweries.csv';

const writeToFile = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log(`Successful Write to ${path}`);
    }
  });
};

const filterBreweries = (json) => {
  return json.reduce((array, brewery) => {
    const { id, name, address1, city, state, code, country } = brewery;
    const newBrewery = {
      id,
      name,
      address1,
      city,
      state,
      code,
      country,
    };
    array.push(newBrewery);
    return array;
  }, []);
};

const filterBeers = (json) => {
  return json.reduce((array, beer) => {
    const { id, brewery_id, name } = beer;
    const cat_id = beer.cat_id === '-1' ? null : beer.cat_id;
    const style_id = beer.style_id === '-1' ? null : beer.style_id;
    const newBeer = {
      id,
      brewery_id,
      name,
      cat_id,
      style_id,
    };
    array.push(newBeer);
    return array;
  }, []);
};

csv().fromFile(beerStylesFile)
  .on('end_parsed', (jsonArrObj) => {
    return writeToFile('./writeData/styles.txt', jsonArrObj);
  })
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });

csv().fromFile(beerCategoriesFile)
  .on('end_parsed', (jsonArrObj) => {
    return writeToFile('./writeData/categories.txt', jsonArrObj);
  })
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });

csv().fromFile(beersFile)
  .on('end_parsed', (jsonArrObj) => {
    const splicedBeers = jsonArrObj.splice(0, 500);
    const filteredBeers = filterBeers(splicedBeers);
    return writeToFile('./writeData/beers.txt', filteredBeers);
  })
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });

csv().fromFile(breweriesFile)
  .on('end_parsed', (jsonArrObj) => {
    const filteredBreweries = filterBreweries(jsonArrObj);
    return writeToFile('./writeData/breweries.txt', filteredBreweries);
  })
  .on('error', (err) => {
    console.log('An Error Has Occured');
    console.log(err);
  })
  .on('done', () => {
    console.log('Scraping Complete');
  });
