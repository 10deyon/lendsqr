exports.up = function(knex) {
   return knex.schema
   .createTable('users', function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('email', 255);
      table.string('password');
      table.string('username').unique();
      table.timestamps();
   });
};

exports.down = function(knex) {
   return knex.schema
   .dropTableIfExists('users');
};
