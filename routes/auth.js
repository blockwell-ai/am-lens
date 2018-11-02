const conf = require('../config');
const Router = require('koa-router');
const router = new Router();
const {passport} = require('../auth');

router.get('/login', async ctx => {
    await ctx.render('login');
});

router.get('/logout', async ctx => {
    ctx.logout();
    ctx.redirect('/');
});

// Only the local Strategy needs this
if (conf.get('auth_strategy') === 'local') {
    router.post('/login', (ctx, next) => {
        return passport.authenticate('local', conf.get('passport'), (err, user, info, status) => {
            if (err) {
                ctx.log.warn('Auth failed', {
                    err: err
                });

                return next(err);
            }

            if (user) {
                ctx.login(user, () => {
                    if (ctx.flash) {
                        ctx.flash.set('Logged in.');
                    }
                    return ctx.redirect('/app');
                });
            } else {
                if (ctx.flash) {
                    ctx.flash.set('Invalid email/password combination.');
                }
                ctx.redirect('/auth/login');
            }
        })(ctx, next);
    });
}

module.exports = router;
