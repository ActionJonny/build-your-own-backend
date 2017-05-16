const fs = require('fs');

const styles = JSON.parse(fs.readFileSync('./writeData/styles.txt').toString());
const categories = JSON.parse(fs.readFileSync('./writeData/categories.txt').toString());

const beerCategories = (knex) => {
  return categories.map((category) => {
    const { id, cat_name } = category;
    return knex('categories').insert({ id, name: cat_name });
  });
};

const beerStyles = (knex) => {
  return styles.map((style) => {
    const { id, cat_id, style_name } = style;
    return knex('styles').insert({ id, name: style_name, category_id: parseInt(cat_id, 10) });
  });
};

exports.seed = (knex, Promise) => {
  return knex('styles').del()
    .then(() => knex('categories').del())
    .then(() => {
      const beerCategory = beerCategories(knex);
      const beerStyle = beerStyles(knex);
      return Promise.all([...beerCategory, ...beerStyle]);
    });
};