
exports.up = function(knex) {
   return knex.schema
   .createTable('transactions', function (table) {
      table.increments('id');
      table.double('amount', 10, 3);
      table.enum('category', ['debit', 'credit']);
      table.string('narration', 255);
      table.integer('user_id').unsigned().references('users.id');
      table.timestamps();
   });
};

exports.down = function(knex) {
   return knex.schema
   .dropTableIfExists('transactions');
};
