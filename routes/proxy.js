const conf = require('../config');
const Router = require('koa-router');
const router = new Router();
const {users} = require('../data');
const axios = require('axios');
const {isAuthenticated} = require('am-lens/auth');

router.use(isAuthenticated);

const baseUrl = conf.get('apiminer_url');

// Request defaults
const defaults = {
    baseURL: baseUrl,
    maxContentLength: 1000000,
    headers: {
        'User-Agent': 'am-lens'
    }
};

/**
 *
 * @param ctx
 * @return {AxiosInstance}
 */
async function getClient(ctx) {
    const client = axios.create(defaults);
    const token = await users.getApiminerToken(ctx.state.user.id);
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return client;
}

router.all('/:path*', async ctx => {
    const client = await getClient(ctx);

    let response;
    try {
        let req = {
            method: ctx.method,
            url: '/' + ctx.params.path
        };

        if (ctx.query && Object.keys(ctx.query).length > 0) {
            req.params = ctx.query;
        }

        if (ctx.request.body && Object.keys(ctx.request.body).length > 0) {
            req.data = ctx.request.body;
        }

        response = await client.request(req);
    } catch (err) {
        ctx.log.warn('Proxied error', {err: err});
        if (err.response) {
            response = err.response;
        } else {
            throw err;
        }
    }

    ctx.status = response.status;
    ctx.body = response.data;
    ctx.response.set(response.headers);
});

module.exports = router;
