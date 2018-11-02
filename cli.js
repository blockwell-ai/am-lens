#!/usr/bin/env node
global.Promise = require("bluebird");
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

const conf = require('./config');
const program = require('commander');
const inquirer = require('inquirer');
const BigNumber = require('bignumber.js');
const auth = require('./auth');
const hash = require('./hash');
const strat = auth.getStrategy();
const {users} = require('./data');
const db = require('./db');

const axios = require('axios');

/**
 * @type {AxiosInstance}
 */
const client = axios.create({
    baseURL: conf.get('apiminer_url'),
    maxContentLength: 1000000,
    headers: {
        'User-Agent': 'am-lens-cli',
        'Authorization': `Bearer ${conf.get('apiminer_token')}`
    }
});

program
    .version('0.0.1');

program
    .command('user <email>')
    .description('Creates a new user')
    .option('-p, --password <password>', 'Set password to this instead of asking for one')
    .action(async (email, cmd) => {
        let auth;
        if (strat.type === 'local') {
            let pass = cmd.password;
            if (!pass) {
                let answers = await inquirer.prompt([{
                    type: 'password',
                    name: 'password',
                    message: 'Enter user password'
                }]);
                pass = answers.password;
            }
            const hashed = await hash.hash(Buffer.from(pass));
            auth = strat.buildAuthObject(hashed.toString('hex'));
        } else {
            auth = {};
        }

        let user = await users.create(email, auth);

        let response = await client.post('/users', {
            name: email,
            externalId: conf.get('app_prefix') + '-' + user.id,
            auth: true,
            account: true
        });

        user.apiminerId = response.data.data.id;
        user.apiminerToken = response.data.auth;
        user.data.address = response.data.account.address;

        await users.update(user);

        console.log(`Created user '${user.email}' with ID ${user.id}`);

        db.destroy();
    });

program
    .command('send <email> <amount>')
    .description('Send tokens to the given user account')
    .action(async (email, amount) => {

        let user = await users.find(email);
        let value = (new BigNumber(amount)).multipliedBy(new BigNumber(`1e${conf.get('token_decimals')}`));

        let response = await client.post(`tokens/${conf.get('token_id')}/transfers`, {
            to: user.data.address,
            value: value.toFixed()
        });

        console.log(`Submitted transfer, it usually takes about 10 seconds to complete.`);

        db.destroy();
    });

if (!process.argv.slice(2).length) {
    program.help();
}
program.parse(process.argv);
