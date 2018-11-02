const config = require('../config');

const axios = require('axios');
const users = require('../data/users');
const ApiMiner = require('./ApiMiner');

// API Miner access token
const apiToken = config.get('apiminer_token');

// Base URL of the API Miner environment
const baseUrl = config.get('apiminer_url');

// Request defaults
const defaults = {
    baseURL: baseUrl,
    maxContentLength: 1000000,
    headers: {
        'User-Agent': 'am-lens'
    }
};

/**
 * Get an ApiMiner client instance for the admin account.
 *
 * @returns {ApiMiner}
 */
function getAdminClient() {
    return new ApiMiner(apiToken, axios.create(defaults));
}

/**
 * Get an ApiMiner client instance for the given user.
 *
 * @param {Object} user
 * @returns {Bluebird<ApiMiner>}
 */
function getClient(user) {
    return users.getApiminerToken(user.id)
        .then(token => {
            return new ApiMiner(token, axios.create(defaults));
        });
}

module.exports = {
    getAdminClient,
    getClient
};
