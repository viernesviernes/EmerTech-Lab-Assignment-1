require('dotenv').config({ path: './src/config/.env' });


var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override')
    const cookieParser = require('cookie-parser');
    const cors = require('cors')

    
module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Accept'],
    }));
    //
    app.use(methodOverride()); 
    app.use(methodOverride('_method'));

    require('../routes/auth.route')(app);
    require('../routes/student.route')(app);
    require('../routes/admin.route')(app);
    require('../routes/course.route')(app);

    app.use(express.static('./public'));
    return app;
};
