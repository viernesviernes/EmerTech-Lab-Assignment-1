require('dotenv').config({ path: './src/config/.env' });

var mongoose = require('mongoose');

module.exports = function () {
    const db = mongoose.connect(process.env.MONGODB_URL, {
        		useUnifiedTopology: true,
		useNewUrlParser: true})
        .then(() => {
            console.log("Successfully connect to the database");
        })
        .catch((err: any) => {
            console.error("Connection error", err);
        });

    require('../models/user.model');
    return db;
};