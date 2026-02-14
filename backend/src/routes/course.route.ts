const course = require('../controllers/course.controller');
const auth = require('../controllers/auth.controller')

module.exports = (app: any) => {
    app.get('/courses', auth.isLoggedIn, auth.isAdmin ,course.listAllCourses);
    app.get('/courses/students/:code',auth.isLoggedIn, auth.isAdmin, course.listAllStudentsInCourse);
    app.post('/courses', auth.isLoggedIn, auth.isAdmin, course.createCourse);
    app.put('/courses/:code', auth.isLoggedIn, auth.isAdmin, course.updateCourse);
    app.delete('/courses/:code', auth.isLoggedIn, auth.isAdmin, course.deleteCourse);
};
