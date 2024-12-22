require('dotenv').config(); // Load .env file
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const connectToDatabase = require('./config/db');
const connectToCloudinary = require('./config/cloudinary');
const app = express();
// Import Routers
const photosRouter = require('./routes/photos'); // Ensure this file exists
const indexRouter = require('./routes/index'); // Ensure this file exists
const usersRouter = require('./routes/users'); // Ensure this file exists


// Database Connection
connectToDatabase()
  .then((db) => {
    app.locals.db = db; // Save database connection globally
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit on database connection failure
  });

// Cloudinary Connection
connectToCloudinary()
try {
  const cloudinary = connectToCloudinary();
  app.locals.cloudinary = cloudinary;
  console.log("Connected to Cloudinary");
} catch (err) {
  console.error("Failed to connect to Cloudinary:", err);
  process.exit(1); // Exit on Cloudinary configuration failure
}


// Middleware Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer().single('file')); // Middleware for handling file uploads


// Mount Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photosRouter); // Route for photos

// Catch 404 and Forward to Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
