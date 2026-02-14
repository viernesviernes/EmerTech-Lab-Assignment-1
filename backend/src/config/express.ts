require('dotenv').config({ path: './src/config/.env' });


var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');
    const cookieParser = require('cookie-parser');
    const cors = require('cors')

    
// Create a new Express application instance
module.exports = function () {
    //Create the Express application object
    var app = express();
    //the process.env property allows you to access predefined environment variables 
    //such as NODE_ENV
    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json()); //use middleware that only parses json
    app.use(cookieParser());
    // CORS: use specific origin + credentials so cookies work with credentials: 'include'
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Accept'],
    }));
    //
    app.use(methodOverride()); // use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    //handle the use of PUT or DELETE methods
    //override with POST having ?_method=DELETE or
    // ?_method=PUT
    app.use(methodOverride('_method'));
    //saveUninitialized - orces a session that is "uninitialized" to be saved to the store
    //resave - forces the session to be saved back to the session store
    // Configure the 'session' middleware
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: process.env.sessionSecret
    }));
    //Configure Express to use EJS module as the default template engine
    // Set the application view engine and 'views' folder
    // app.set('views', './app/views');
    // app.set('view engine', 'ejs');
    // app.engine('html', require('ejs').renderFile);
    //bootstrap the app using the controller and routing modules
    // Load the routing files
    require('../routes/auth.route')(app);
    require('../routes/student.route')(app);
    require('../routes/admin.route')(app);
    require('../routes/course.route')(app);
    //The express.static() middleware takes one argument 
    //to determine the location of the static folder
    //Configure static file serving
    app.use(express.static('./public'));
    return app;
};
