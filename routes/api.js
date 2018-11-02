const conf = require('../config');
const validate = require('../middleware/validate');
const err = require('../error');
const Router = require('koa-router');
const router = new Router();
const Joi = require('joi');
const {isAuthenticated} = require('../auth');
const {users} = require('../data');

router.use(isAuthenticated);

router.get('/user/:email/address', validate({
    params: {
        email: Joi.string().email()
    }
}), async ctx => {
    const user = await users.find(ctx.params.email);

    if (user) {
        ctx.body = {
            address: user.data.address
        }
    } else {
        throw err.notFound('User not found');
    }
});

module.exports = router;
