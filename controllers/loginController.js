let userModel = require('../models/user');


exports.loginPage = (req, res) => {
    res.render('login', {loginCSS: true });
};

exports.login = (req, res) => {
    userModel.userLogin(req.body)
    .then(([rows, field]) => {
        if(rows.length > 0){
            res.render('home', {homeCSS: true, user: rows[0] });
        } else {
            res.render('login', {loginCSS: true, loginFail: true})
        }
    })
    .catch((error) => console.log("login error: " + error));
};
 
exports.registerPage = (req, res) => {
    res.render('signup', {registerCSS: true, userInfo: req.body });
};

exports.register = (req, res) => {
    userModel.registerUser(req.body)
    .then(([rows, field]) => {
        res.render('home', {homeCSS: true });
    })
    .catch((error) => console.log("error: " + error));
};