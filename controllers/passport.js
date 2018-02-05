/**
 * Created by HP on 04.02.2018.
 */

var passport = require('passport'),
    funct = require('../helpers/functions'),
    LocalStrategy = require('passport-local');
    mongoose = require('mongoose');

var express = require('express');


passport.serializeUser(function(user,done){
    console.log("serializing" + user.username);
    done(null,user);
});
passport.deserializeUser(function(obj,done){
    console.log("deserializing" + obj);
    done(null,obj);
});

passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.';
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));

module.exports = passport;