const auth = require('../controllers/auth.controller');

module.exports = (app: any) => {
    app.post('/signin/admin', auth.signInHandler(true));
    app.post('/signin/student', auth.signInHandler(false));
    app.get('/signout', auth.signout);
};