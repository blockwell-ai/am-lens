const conf = require('../config');
const passport = require('./passport');

function isAuthenticated(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/auth/login')
    }
}

/**
 *
 * @return {{type: String, strategy: passport.Strategy, buildAuthObject: function(Object)}}
 */
function getStrategy() {
    return require(`./strategy/${conf.get('auth_strategy')}`);
}

passport.use(getStrategy().strategy);

module.exports = {
    passport,
    isAuthenticated,
    getStrategy
};
