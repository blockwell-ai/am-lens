

class ApiGroup {
    /**
     * Constructor.
     *
     * @param {AxiosInstance} client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param {AxiosRequestConfig} config
     * @return {Promise<Object>}
     */
    request(config) {
        return this.client(config)
    }
}

module.exports = ApiGroup;
