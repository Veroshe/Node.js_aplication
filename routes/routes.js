/**
 * Created by HP on 04.02.2018.
 */
var express = require('express');
var app = express();
var ensureAuthenticated = require('../middleware/functions');
var test = require('../controllers/test');
var theory = require('../controllers/theory');
var exercise = require('../controllers/exercise');
var contact = require('../controllers/contact');
var passport = require('../controllers/passport');
var user = require('../controllers/user');

app.get('/',function(req,res){
    res.render('home',{user:req.user});
});
//TEST
app.get('/test', ensureAuthenticated.ensureAuthenticated, test.getTest);
app.post('/test', test.postTest);
//THEORY
app.get('/intro', theory.getIntro);

app.get('/basics', theory.getDef);
app.get('/basics1', theory.getMem);
app.get('/basics2', theory.getCalc);
app.get('/basics3', theory.getNorm);
app.get('/mamdani', theory.getSection2);
app.get('/zadania_s', exercise.getExercise2);
app.get('/zadania_s/:id', exercise.getExercise);

app.post('/zadania_s/:id', exercise.postExercise);
app.get('/contact', contact.getContact);

app.post('/login', passport.authenticate('local-signin',{
    successRedirect: '/',
    failureRedirect: '/'})
);

app.get('/logout', user.logout);

module. exports = app;