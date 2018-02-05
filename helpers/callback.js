/**
 * Created by HP on 04.02.2018.
 */

var User = require('../model/user');

exports.callback = function(res,req,mistakes,goodanswers) {

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
};
module.exports = exports;