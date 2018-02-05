/**
 * Created by HP on 04.02.2018.
 */

var Contact = require('../model/contact');
exports.getContact = function(req,res){

    Contact.findOne({},{},function(err,ret){
        if(err) throw err;
        else{
            res.render('contact',{
                "content": ret
            })
        }
    })
};

module.exports = exports;