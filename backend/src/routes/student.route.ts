const student = require('../controllers/student.controller');
const auth = require('../controllers/auth.controller');

module.exports = (app: any) => {
    app.get('/student', auth.isLoggedIn, student.getUserInfo);
    app.get('/student/courses', auth.isLoggedIn, student.listUserCourses);
    app.post('/student/courses', auth.isLoggedIn, student.addCourse);
    app.put('/student/courses/:code', auth.isLoggedIn, student.updateCourse);
    app.delete('/student/courses', auth.isLoggedIn, student.dropCourse);
};
