const fs = require('fs');

const styles = JSON.parse(fs.readFileSync('./writeData/styles.txt').toString());
const categories = JSON.parse(fs.readFileSync('./writeData/categories.txt').toString());
const beers = JSON.parse(fs.readFileSync('./writeData/beers.txt').toString());
const breweries = JSON.parse(fs.readFileSync('./writeData/breweries.txt').toString());

const beerCategories = (knex) => {
  return categories.map((category) => {
    const { id, cat_name } = category;
    return knex('categories').insert({ category_id: id, name: cat_name });
  });
};

const beerStyles = (knex) => {
  return styles.map((style) => {
    const { id, cat_id, style_name } = style;
    return knex('styles').insert({ style_id: id, name: style_name, category_id: parseInt(cat_id, 10) });
  });
};

const breweriesJSON = (knex) => {
  return breweries.map((brewery) => {
    const { id, name, address1, city, state, code, country } = brewery;
    return knex('breweries').insert({ brewery_id: id, name, address1, city, state, code, country });
  });
};

const beersJSON = (knex) => {
  return beers.map((beer) => {
    const { id, name, brewery_id } = beer;
    const style_id = beer.style_id === null ? beer.style_id : parseInt(beer.style_id, 10);
    const cat_id = beer.cat_id === null ? beer.cat_id : parseInt(beer.cat_id, 10);
    return knex('beers').insert({ beer_id: id, name, cat_id, style_id, brewery_id: parseInt(brewery_id, 10) });
  });
};


exports.seed = (knex, Promise) => {
  return knex('styles').del()
    .then(() => knex('categories').del())
    .then(() => knex('beers').del())
    .then(() => knex('breweries').del())
    .then(() => {
      const beerCategory = beerCategories(knex);
      const beerStyle = beerStyles(knex);
      const breweriesArray = breweriesJSON(knex);
      const beersArray = beersJSON(knex);
      return Promise.all([...beerCategory, ...beerStyle, ...breweriesArray, ...beersArray]);
    });
};