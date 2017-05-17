
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('breweries', (table) => {
      table.increments('id').primary();
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
      table.string('name');
      table.string('cat_id');
      table.string('style_id');
      table.integer('brewery_id').unsigned();
      table.foreign('brewery_id')
        .references('breweries.id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('beers'),
    knex.schema.dropTable('breweries'),
  ]);
};
