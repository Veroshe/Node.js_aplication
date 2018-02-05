


exports.logout  = function(req,res){
    var name = req.user.username;
    console.log("LOGGIN OUT" + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.noitce = "You have successfully been logged out" + name + "!!";
};

module.exports = exports;

