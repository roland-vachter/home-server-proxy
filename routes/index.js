"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var httpProxy = require('http-proxy');
var env = require('../env');


var remoteAddress = null;


passport.serializeUser(function(user, done) {
    console.log('user', user);

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
        remoteAddress = req.body.address;

        console.log('remoteAddress', remoteAddress);

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



var proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
	if (req.user) {
        if (req.user.accessLevel === 'readOnly') {
            proxyReq.setHeader('API_KEY', env.apiKeys.server.readOnly);
        } else if (req.user.accessLevel === 'admin') {
            proxyReq.setHeader('API_KEY', env.apiKeys.server.admin);
        }
	}
});


router.get('/remoteaddress', isLoggedIn, function (req, res, next) {
    if (req.user) {
        res.send(remoteAddress);
    } else {
        res.sendStatus(403);
    }
});
router.get('/*', isLoggedIn, function(req, res, next) {
	if (req.user) {
        try {
    		proxy.web(req, res, {
    			target: remoteAddress
    		});
        } else {
            res.send("Remote server unreachable.");
        }
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
