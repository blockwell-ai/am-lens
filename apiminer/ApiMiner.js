const Accounts = require('./Accounts');
const Contracts = require('./Contracts');

/**
 * Simple client for API Miner.
 */
class ApiMiner {
    /**
     * Constructor.
     *
     * @param {String} accessToken
     * @param {AxiosInstance} client
     */
    constructor(accessToken, client) {

        client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        this.client = client;

        this.accounts = new Accounts(client);
        this.contracts = new Contracts(client);
    }
}

module.exports = ApiMiner;
