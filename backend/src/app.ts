require('./models/user.model');

var mongoose = require('./config/mongoose'),
 express = require('./config/express');

require('dotenv').config({ path: './src/config/.env' });
console.log(process.env.S3_BUCKET)

mongoose();

const app = express();



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})

module.exports = app;