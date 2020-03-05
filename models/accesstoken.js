'use strict';

const mongoose = require('mongoose');
const cryptoUtils = require('../utils/crypto');
const Schema = mongoose.Schema;
const maxAccessTokenAge = parseInt(process.env.OAUTH2_ACCESS_TOKEN_EXPIRES_IN) || require('../config.json').oauth2.access_token_expires_in
const uidLength = 256;

const AccessTokenSchema = new mongoose.Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    token: { type: String, required: true },
    scope: { type: [String], default: [] },
    expirationDate: { type: Date, required: true }
});

AccessTokenSchema.statics.tokenUid = function () {
    return cryptoUtils.generateUid(uidLength);
};

AccessTokenSchema.statics.hashToken = function (plainToken) {
    return cryptoUtils.hashData(plainToken);
};

AccessTokenSchema.virtual('tokenHash').set(function (plainToken) {
    this.token = this.constructor.hashToken(plainToken);
});

AccessTokenSchema.pre('validate', function (next) {
    if (!this.expirationDate) {
        this.expirationDate = new Date(new Date().getTime() + maxAccessTokenAge);
    } next();
});

// Export the Mongoose model
module.exports = mongoose.model('AccessToken', AccessTokenSchema);