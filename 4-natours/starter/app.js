const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const app = express();

//  1) MIDDLEWARES
// the below code is considered middleware. Middleware is a function, that can modify the incoming request data.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Srving/accesing static files
app.use(express.static(`${__dirname}/public`));
// custom middleware
app.use((req, rex, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, rex, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
