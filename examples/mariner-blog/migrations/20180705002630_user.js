exports.up = knex =>
  knex.schema.withSchema('public').createTable('user', table => {
    table.increments();
    table.string('username');
    table.string('name');
    table.string('email');
    table.string('password');
    table.string('salt');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique('username');
    table.unique('email');
  });

exports.down = knex => knex.schema.dropTable('user');
