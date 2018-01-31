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
    LocalStrategy = require('passport-local'),
mongoose = require('mongoose'),
    funct = require('./functions.js');
var app = express();

//---------------------PASSPORT

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
var Test = require('./model/exercise');
var Theory = require('./model/theorytext');
var Definition = require('./model/section21');
var Membership = require('./model/section22_24');
var Calculation = require('./model/section23');
var User = require('./model/user');
var Contact = require('./model/contact');

db.on('error', console.error.bind(console,'MongoDB connection error: '));
//---------------------ROUTES

app.get('/',function(req,res){
    res.render('home',{user:req.user});
});




app.post('/login',passport.authenticate('local-signin',{
    successRedirect: '/',
    failureRedirect: '/'})
);

app.get('/logout',function(req,res){
    var name = req.user.username;
    console.log("LOGGIN OUT" + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.noitce = "You have successfully been logged out" + name + "!!";
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Zaloguj sie!';
    res.redirect('/');
}
//-----------------TEST QUESTIONS

app.get('/test', ensureAuthenticated,
    function(req,res){
    Test.aggregate([{$match: { type : "Zadanie testowe" }}, { $sample:{size:10}}],function(err,ret) {
        if(err) throw err;
        else {
            console.log(ret);
            res.render('test',{
                "content":ret,
                "user":req.user

            });
        }
    })

});
function callback(res,req,mistakes,goodanswers) {

    if (temp === true) {
        req.session.success = 'Dobrze rozwiazany test';

        User.findOneAndUpdate(
            {   "username" : req.user.username},
            {   $inc: { "testsdone" :   1, "testspassed": 1}  }, function(err,ret) {
                if (err) console.log(err);
                else {
                    console.log(ret);
                    res.redirect('/test');
                }
            });


    }
    else {
        User.findOneAndUpdate(
            {   "username" : req.user.username},
            {   $inc: { "testsdone" :   1}  }, function(err,ret) {
                if (err) console.log(err);
                else {
                    console.log(ret);
                    let error = '<b>Zle rozwiazany test, masz błędy w pytaniach:</b> </br>';
                    for(let x=0;x<mistakes.length;x++){
                        error+=mistakes[x];
                        error+= '</br> poprawna odpowiedź na to pytanie to: </br> <b>';
                        error+=goodanswers[x];
                        error+='</br> </b>';
                    }
                    req.session.error = error;
                    res.redirect('/test');
                }
            });

    }
}

app.post('/test',function(req,res) {
    console.log(req.body);

    var array = [];
    temp = true;

    for (var value in req.body) {
        array.push(value);
    }

    var itemProcessed = 0;
    var mistakes = [];
    var goodanswers = [];
    array.forEach(function (i) {
        Test.findOne({'_id': i}, {}, function (err, ret) {

            if (err) throw err;
            else {
                if (ret.goodanswer === req.body[i]) {
                }
                else {
                    mistakes.push(ret.question);
                    goodanswers.push(ret.goodanswer);
                    temp = false;
                }
            }
            itemProcessed++;
            if (itemProcessed === array.length) {
                callback(res,req,mistakes,goodanswers);
            }
        });
    });
});

//-----------------THEORY

app.get('/intro', function(req,res){
    Theory.findOne({'section':'Intro'},{},function(err,ret){
        if(err) throw err;
        else {
            console.log(ret);
            console.log(ret.title);
            res.render('theorytext', {
                "theory": ret,
                "user":req.user
            });
        }
    })
});

app.get('/basics',function(req,res){
    Definition.find({},{},function(err,ret){
        if(err) throw err;
        else{
            console.log(ret);
            res.render('basics',{
                "content": ret,
                "basic": 1,
                "user":req.user
            });
        }
    })
});
app.get('/basics1',function(req,res){
    Membership.find({"section":"Membership function section"},{},function(err, ret){
        if (err) throw err;
        else {
            console.log(ret);
            res.render('basics',{
                "content": ret,
                "basic1" : 1,
                "user":req.user

            });
        }
    })
});
app.get('/basics2',function(req,res){
    Calculation.find({},{},function(err, ret){
        if (err) throw err;
        else {
            console.log(ret);
            res.render('basics',{
                "content": ret,
                "basic2" : 1,
                "user":req.user

            });
        }
    })
});
app.get('/basics3',function(req,res){
    Membership.find({"section":"Norms section"},{},function(err, ret){
        if (err) throw err;
        else {
            console.log(ret);
            res.render('basics',{
                "content": ret,
                "basic3" : 1,
                "user":req.user

            });
        }
    })
});
app.get('/mamdani', function(req,res){
    Theory.findOne({'section':'Section1'},{},function(err,ret){
        if(err) throw err;
        else {
            console.log(ret);
            console.log(ret.title);
            res.render('theorytext', {
                "theory": ret,
                "user":req.user
            });
        }
    })
});
app.get('/sugeno', function(req,res){
    Theory.findOne({'section':'Section2'},{},function(err,ret){
        if(err) throw err;
        else {
            console.log(ret);
            console.log(ret.title);
            res.render('theorytext', {
                "theory": ret,
                "user":req.user
            });
        }
    })
});
//-----------------TEXTEXERCISES

app.get('/zadania_s', function(req,res) {
    Test.find({"type": "Zadanie tekstowe"}, {}, function (err, ret) {
        if (err) throw err;
        else {
            res.render('exercise', {
                "content": ret,
                "all": 1,
                "user": req.user
            });
        }

    })
});

app.get('/zadania_s/:id', function(req,res){
    let id = req.params.id;
    Test.findOne({"_id":id},{},function(err,ret){
        if(err) throw err;
        else{
            res.render('exercise',{
                "content": ret,
                "one": 1,
                "user":req.user
            })
        }
    })
});

app.post('/zadania_s/:id',function(req,res){
    console.log(req.body);
    let id = req.params.id;
    Test.findOne({"_id": id},{},function(err,ret){
        if(err) throw err;
        else{
            console.log(ret);
            console.log(req.body.answer);
            if(ret.goodanswer === req.body.answer){
                User.findOneAndUpdate(
                    {   "username" : req.user.username},
                    {   $inc: { "exercisesdone" :   1, "exercisespassed": 1}  }, function(err,ret) {
                        if (err) console.log(err);
                        else {
                            console.log(ret);
                            req.session.success = 'Gratulacje, poprawnie rozwiązałeś zadanie!';
                            res.redirect('/zadania_s');
                        }
                    });

            }
            else {
                User.findOneAndUpdate(
                    {   "username" : req.user.username},
                    {   $inc: { "exercisesdone" :   1}  }, function(err,ret) {
                        if (err) console.log(err);
                        else {
                            console.log(ret);
                            req.session.error = 'Niestety, źle rozwiązałeś zadanie. Spróbuj ponownie';
                            res.redirect('/zadania_s/' + id);
                        }
                    });
            }
        }

    })
});

app.get('/contact', function(req,res){

    Contact.findOne({},{},function(err,ret){
        if(err) throw err;
        else{
            res.render('contact',{
                "content": ret
            })
        }
    })
});
//-----------------PORT

var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!!!");
