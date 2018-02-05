/**
 * Created by HP on 07.12.2017.
 */
var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    mongoose = require('mongoose');
var app = express();

//---------------------EXPRESS
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + ''));
app.use(require('./routes/routes'));


app.use(function(req,res,next){
    var err=req.session.error,
        msg=req.session.notice,
        success=req.session.success;

    delete  req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if(err) res.locals.error = err;
    if(msg) res.locals.notice = msg;
    if(success) res.locals.success = success;

    next();
});



var hbs = exphbs.create({
    defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//---------------------MONGO
var mongoDB = 'mongodb://127.0.0.1/auth';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;


db.on('error', console.error.bind(console,'MongoDB connection error: '));



var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!!!");
