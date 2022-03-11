
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('wallets').del()
    .then(function () {
      // Inserts seed entries
      return knex('wallets').insert([
        {
          id: 1, 
          amount: 2000.00, 
          balance_snapshot: 2000.00,
          narration: 'this is the narration',
          user_id: 1
        },
      ]);
    });
};
