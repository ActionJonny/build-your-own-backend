
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('categories', (table) => {
      table.increments('id').primary();
      table.string('name').unique();

      table.timestamps(true, true);
    }),

    knex.schema.createTable('styles', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('category_id').unsigned();
      table.foreign('category_id')
        .references('categories.id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('styles'),
    knex.schema.dropTable('categories'),
  ]);
};