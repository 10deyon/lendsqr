exports.up = function(knex) {
   return knex.schema
      .createTable('wallets', function (table) {
      table.increments('id');
      table.double('amount', 10, 3);
      table.double('balance_snapshot', 10, 3);
      table.integer('user_id').unsigned().references('users.id');
      table.timestamps();
   });
};

exports.down = function(knex) {
   return knex.schema
   .dropTableIfExists('wallets');
};
