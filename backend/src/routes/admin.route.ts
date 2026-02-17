const admin = require('../controllers/admin.controller');
const auth = require('../controllers/auth.controller');

// So admin update/delete get the target student id from the URL
function setUserIdFromParam(req: any, res: any, next: any) {
    req.userId = req.params.userId;
    next();
}

module.exports = (app: any) => {
    // Create admin (public route; requires adminKey in body to match env ADMIN_KEY)
    app.post('/admin/create', admin.createAdmin);
    // Protected admin routes (require login + admin role)
    app.get('/admin/students', auth.isLoggedIn, auth.isAdmin, admin.listAllStudents);
    app.post('/admin/student', auth.isLoggedIn, auth.isAdmin, admin.createStudentAccount);
    app.put('/admin/students/:userId', auth.isLoggedIn, auth.isAdmin, setUserIdFromParam, admin.updateStudentAccount);
    app.delete('/admin/students/:userId', auth.isLoggedIn, auth.isAdmin, setUserIdFromParam, admin.deleteStudentAccount);
};
