/**
 * Created by HP on 04.02.2018.
 */
var express = require('express'),
    app = express();
var Test = require('../model/exercise');

exports.getExercise = function(req,res){
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
};
exports.getExercise2 = function(req,res) {
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
};

exports.postExercise = function(req,res){
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
};

module.exports = exports;