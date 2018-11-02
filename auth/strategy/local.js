const LocalStrategy = require('passport-local').Strategy;
const {users} = require('../../data');
const hash = require('../../hash');

const strategy = new LocalStrategy((username, password, done) => {
    users.find(username.toLowerCase())
        .then(async user => {
            if (user) {
                const verify = await hash.verify(Buffer.from(password), Buffer.from(user.auth.local.password, 'hex'));
                if (verify === hash.VALID) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        })
        .catch(done);
});

function buildAuthObject(input) {
    return {
        local: {
            password: input,
            updated: Date.now()
        }
    }
}

module.exports = {
    type: 'local',
    strategy,
    buildAuthObject
};
