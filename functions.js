/**
 * Created by HP on 07.12.2017.
 */
var bcrypt = require('bcryptjs'),
    Q = require('q');

var mongodbURl = 'mongodb://127.0.0.1/auth';
var MongoClient = require('mongodb').MongoClient;

//local-signup strategy

exports.localReg = function(username, password){
    var deffered = Q.defer();

    MongoClient.connect(mongodbURl,function(err,db){
        var collection = db.collection('localusers');

        //check if username is already assignd in out database
        collection.findOne({'username': username})
            .then(function(result){
                if(null!=result){
                    console.log("USERNAME ALREADY EXISTS: ", result.username);
                    deffered.resolve(false); //username exists
                }
                else{
                    var hash = bcrypt.hashSync(password,8);
                    var user = {
                        "username": username,
                        "password": hash
                    }
                    console.log("CREATING USER" + username );

                    collection.insert(user)
                        .then(function(){
                            db.close();
                            deffered.resolve(user);
                        });
                }
            });
    });
    return deffered.promise;
};

//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
    var deferred = Q.defer();

    MongoClient.connect(mongodbURl, function (err, db) {
        var collection = db.collection('localusers');

        collection.findOne({'username' : username})
            .then(function (result) {
                if (null == result) {
                    console.log("USERNAME NOT FOUND:", username);

                    deferred.resolve(false);
                }
                else {
                    var hash = result.password;

                    console.log("FOUND USER: " + result.username);

                    if (bcrypt.compareSync(password, hash)) {
                        deferred.resolve(result);
                    } else {
                        console.log("AUTHENTICATION FAILED");
                        deferred.resolve(false);
                    }
                }

                db.close();
            });
    });

    return deferred.promise;
}
