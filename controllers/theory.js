/**
 * Created by HP on 04.02.2018.
 */

var Theory = require('../model/theorytext');
var Definition = require('../model/section21');
var Membership = require('../model/section22_24');
var Calculation = require('../model/section23');

exports.getIntro = function(req,res){
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
};

exports.getDef = function(req,res){
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
};

exports.getMem = function(req,res){
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
};

exports.getCalc = function(req,res){
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
};

exports.getNorm = function(req,res){
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
};

exports.getSection1 = function(req,res){
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
};
exports.getSection2 = function(req,res){
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
};

module.exports = exports;