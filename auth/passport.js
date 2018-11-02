const passport = require('koa-passport');
const {users} = require('../data');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    users.get(id)
        .then(user => done(null, user))
        .catch(done);
});

module.exports = passport;
