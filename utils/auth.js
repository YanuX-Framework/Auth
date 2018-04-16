'use strict';

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');

// HTTP Authentication
module.exports.ensureHttpBasicAuth = passport.authenticate('basic', { session: false });
module.exports.ensureHttpBearerAuth = passport.authenticate('bearer', { session: false });
module.exports.ensureHttpAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });

// HTTP Client Authentication
module.exports.ensureClientHttpBasicAuth = passport.authenticate('client-basic', { session: false });

// Passport Local Session-based Authentication
module.exports.ensureLoggedIn = connectEnsureLogin.ensureLoggedIn('/auth/login');

// Client Authentication
module.exports.ensureClientAuth = passport.authenticate(['client-basic', 'oauth2-client-password'], { session: false });