const path = require('path');

// const migrations = path.join(__dirname, '/migrations');
// const seeds = path.join(__dirname, '/seeds');

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: 'localhost',
      user: 'admin',
      password: '9812',
      database: 'lendsqr_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
      // host: process.env.DB_HOST,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: path.join(__dirname, "/seeds"),
    },
    pool: { min: 0, max: 7 }
  }
};
