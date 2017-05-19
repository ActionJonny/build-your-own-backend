
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('categories', (table) => {
      table.increments('id').primary();
      table.integer('category_id').unique();
      table.string('name').unique();

      table.timestamps(true, true);
    }),

    knex.schema.createTable('styles', (table) => {
      table.increments('id').primary();
      table.integer('style_id').unique();
      table.string('name');
      table.integer('category_id').unsigned();
      table.foreign('category_id')
        .references('categories.category_id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('styles'),
    knex.schema.dropTable('categories'),
  ]);
};