exports.up = knex =>
  knex.schema.withSchema('public').createTable('user', table => {
    table.increments();
    table.string('username');
    table.string('name');
    table.string('email');
    table.string('password');
    table.string('salt');
    table.timestamps();
  });

exports.down = knex => knex.schema.dropTable('user');
