const apn = require('apn');

const options = {
    token: {
        key: 'path/to/APNsAuthKey.p8',
        keyId: 'APNs key ID',
        teamId: 'APNs team ID',
    },
    production: false // Set to true for production environment
};

const apnProvider = new apn.Provider(options);

module.exports = apnProvider;