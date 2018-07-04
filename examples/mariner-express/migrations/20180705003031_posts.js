exports.up = knex =>
  knex.schema.withSchema('public').createTable('post', table => {
    table.increments();
    table.string('body');
    table.string('title');
    table.integer('user_id');
    table.foreign('user_id').references('user.id');
    table.timestamps();
  });

exports.down = knex => knex.schema.dropTable('post');
