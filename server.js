const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config /db');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookie = require('cookie-parser');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database 
connectDB();

// ROute files 
const clients = require('./routes/clients');
const auth = require('./routes/auth');

const app = express();

// Body parser 
app.use(express.json());

// Cookie parser 
app.use(cookie());

// Dev logging middleware 
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// File uploading 
app.use(fileUpload());

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));


// Mount routers    
app.use('/api/v1/clients', clients);
app.use('/api/v1/auth', auth);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandles promise rejections 
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process 
    server.close(() => process.exit(1));
});
