const ApiGroup = require('./ApiGroup');

class Accounts extends ApiGroup {

    /**
     * List Accounts belonging to the current user.
     *
     * @return {Promise<Object[]>}
     */
    list() {
        return this.request({
            url: '/accounts'
        }).then(response => response.data.data);
    }

    /**
     * Generates a new Ethereum account.
     *
     * @param {String?} owner (Optional) Account owner's user ID
     * @param {boolean?} makeDefault (Optional) Make the account the user's default account
     * @return {Promise<Object>}
     */
    create(owner = undefined, makeDefault = undefined) {
        return this.request({
            method: 'post',
            url: '/accounts',
            data: {
                owner: owner,
                'default': makeDefault
            }
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
            url: `/accounts/${id}`
        }).then(response => response.data.data);
    }
}

module.exports = Accounts;
