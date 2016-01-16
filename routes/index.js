"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var env = require('../env');
const crypto = require('../app/utils/crypto');
const proxy = require('../app/proxy');


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});


passport.use(new FacebookStrategy({
        clientID: env.facebook.app.id,
        clientSecret: env.facebook.app.secret,
        callbackURL: env.ownHost + "/login/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    	if (profile && profile.emails && profile.emails.length) {
            let typeOfAccess = null;

            for (let i = 0; i < profile.emails.length; i++) {
                let email = profile.emails[i].value;

                if (env.users.admin.indexOf(email) !== -1) {
                    typeOfAccess = 'admin';
                    break;
                }

                if (env.users.readOnly.indexOf(email) !== -1) {
                    typeOfAccess = 'readOnly';
                }
            }

    		if (typeOfAccess !== null) {
                profile.accessLevel = typeOfAccess;
    			done(null, profile);
    			return;
    		}
        }

        done(new Error("Forbidden."));
    }
));

router.post('/register', function(req, res, next) {
    if (req.get('API_KEY') === env.apiKeys.own && req.body.hasOwnProperty('address')) {
        proxy.register(req.body.address, crypto.decrypt(req.body.readOnlyApiKey), crypto.decrypt(req.body.adminApiKey));

        res.sendStatus(200);
        return;
    } else {
        console.log('remoteAddress set failed. apiKey not correct.');
    }

    res.sendStatus(403);
});

router.get('/forbidden', function (req, res, next) {
	res.sendStatus(403);
});


router.get('/login/facebook', passport.authenticate('facebook', {
	scope : 'email'
}));

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback', passport.authenticate('facebook', {
	successRedirect : '/',
	failureRedirect : '/forbidden'
}));


router.get('/', isLoggedIn, function (req, res, next) {
	if (req.user) {
		res.render('index');
	} else {
		res.sendStatus(403);
	}
});
router.all('/api/*', isLoggedIn, function(req, res, next) {
	if (req.user) {
		proxy.proxyHttp(req, res, function (e) {
            res.json({
            	error: "Remote server unreachable."
            });
        });
	} else {
		res.sendStatus(403);
	}
});
router.all('/socket.io/*', isLoggedIn, function(req, res, next) {
	if (req.user) {
		proxy.proxyHttp(req, res, function (e) {
            res.json({
            	error: "Remote server unreachable."
            });
        });
	} else {
		res.sendStatus(403);
	}
});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login/facebook');
}

module.exports = router;
