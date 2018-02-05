/**
 * Created by HP on 04.02.2018.
 */

var Test = require('../model/exercise');
var callback = require('../helpers/callback');
exports.getTest = function(req,res) {
    Test.aggregate([{$match: {type: "Zadanie testowe"}}, {$sample: {size: 10}}], function (err, ret) {
        if (err) throw err;
        else {
            console.log(ret);
            res.render('test', {
                "content": ret,
                "user": req.user

            });
        }
    })
};
exports.postTest = function(req,res) {
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
};

module.exports = exports;