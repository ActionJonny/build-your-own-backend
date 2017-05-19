
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('breweries', (table) => {
      table.increments('id').primary();
      table.integer('brewery_id').unique();
      table.string('name');
      table.string('address1');
      table.string('city');
      table.string('state');
      table.string('code');
      table.string('country');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('beers', (table) => {
      table.increments('id').primary();
      table.integer('beer_id').unique();
      table.string('name');
      table.integer('cat_id').unsigned();
      table.foreign('cat_id')
        .references('categories.category_id');
      table.integer('style_id').unsigned();
      table.foreign('style_id')
        .references('styles.style_id');
      table.integer('brewery_id').unsigned();
      table.foreign('brewery_id')
        .references('breweries.brewery_id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('beers'),
    knex.schema.dropTable('breweries'),
  ]);
};
