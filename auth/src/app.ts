require('./models/student.model');
require('./models/course.model');
require('./models/admin.model');

var mongoose = require('./config/mongoose'),
 express = require('./config/express');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

mongoose();

const app = express();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

module.exports = app;