require('dotenv').config({ path: './src/config/.env' });

var mongoose = require('mongoose');

module.exports = function () {
    const db = mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Successfully connect to the database");
        })
        .catch((err: any) => {
            console.error("Connection error", err);
        });

    require('../models/student.model');
    require('../models/course.model');
    require('../models/admin.model');
    return db;
};