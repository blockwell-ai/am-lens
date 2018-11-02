const db = require('knex')(require(process.cwd() + '/knexfile')[process.env.NODE_ENV]);

module.exports = db;
