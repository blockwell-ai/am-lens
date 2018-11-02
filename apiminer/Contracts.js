const ApiGroup = require('./ApiGroup');

class Contracts extends ApiGroup {

    /**
     * List Contracts belonging to the current user.
     *
     * @param {String?} network
     * @param {String?} name
     * @return {Promise<Object[]>}
     */
    list(network, name) {
        return this.request({
            url: '/contracts'
        }).then(response => response.data.data);
    }

    /**
     * Deploy a new smart contract.
     *
     * @param {String} name Contract name
     * @param {String|Number} network Network to deploy on
     * @param {String} type Contract type
     * @param {Object?} opts
     * @param {String?} opts.account ID of the account to use
     * @param {Object?} opts.parameters Contract parameters for the contract type
     * @param {String[]?} opts.callbacks Callback URLs
     * @param {Object?} opts.callbackData Data for the callback
     * @return {Promise<Object>}
     */
    deploy(name, network, type, opts) {
        return this.request({
            method: 'post',
            url: '/contracts',
            data: Object.assign({
                name: name,
                network: network,
                type: type
            }, opts)
        }).then(response => response.data.data);
    }

    /**
     * Get a specific Account by its ID.
     *
     * @param {String} id
     * @return {Promise<Object>}
     */
    get(id) {
        return this.request({
            url: `/contracts/${id}`
        }).then(response => response.data.data);
    }
}

module.exports = Contracts;
