var express = require('express');
const user = require('../controllers/user.controller');

module.exports = (app: any) => {

    app.post("/", user.CreateUser);

    app.post('/signin', user.authenticate);
    app.get('/signout', user.signout);
    app.get('/read_cookie', user.isSignedIn);
    app.get('/testRoute', user.isLoggedIn, user.testRoute);
    app.post('/user/update', user.isLoggedIn, user.updateUser)

    app.route('/user',)
    .get(user.isLoggedIn, user.getUserInfo)
    .post(user.isLoggedIn, user.updateUser)
    .delete(user.isLoggedIn, user.deleteUser)
    

}
