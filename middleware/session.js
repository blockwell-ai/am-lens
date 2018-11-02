const session = require('koa-session');
const Store = require('koa-session-knex-store');
const flash = require('koa-flash-simple');
const db = require('../db');
const {passport} = require('../auth');

const store = Store(db);

module.exports = function addSession(app) {
    app.use(session({store}, app));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
};
