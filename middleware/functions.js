
var express = require('express');
var app = express();

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Zaloguj sie!';
    res.redirect('/');
};
module.exports = exports;
