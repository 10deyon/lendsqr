const knexConfig = require("./database/knexfile")

let knex = null
if (process.env.APP_STATE === "development") {
  knex = require('knex')(knexConfig[process.env.APP_STATE])
} else {
  knex = require('knex')(knexConfig[process.env.APP_STATE])
}

module.exports = knex
