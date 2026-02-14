const auth = require('../controllers/auth.controller');

module.exports = (app: any) => {
    app.post('/signIn/admin', auth.signInHandler(true));
    app.post('/signIn/student', auth.signInHandler(false));
    app.get('/signout', auth.signout);
};
