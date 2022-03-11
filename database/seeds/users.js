exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Hettie Marshall',
          email: 'lantunde@test.com',
          password: 'secret',
          username: 'hettie10'
        },
      ]);
    });
};