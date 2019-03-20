const express = require('express');
const router = require('express').Router();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const Voter = require('./models/voter');
const Constituency = require('./models/constituency');
const Election = require('./models/election');
const createError = require('http-errors');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//passport config
require('./config/passport')(passport);
//Configure Mongoose
mongoose.connect("mongodb://localhost/CSSD_eVoting", {useNewUrlParser:true});
mongoose.set('debug', true);

var connection = mongoose.connection;
connection.on('connected',function(){
	console.log('connected to db')
});

connection.on('disconnected',function(){
	console.log('disconnected to db')
});

connection.on('error',function(error){
	console.log('db connection error', error)
});

//routes
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var ballotRouter = require('./routes/ballot');
var proxyRouter = require('./routes/proxy');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('abcd'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(session({
    secret:'test',
    resave:true,
    saveUnitialized:true}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

var options ={
  explorer: true
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));





require('./models/voter');

app.use('/api-docs',router);

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/ballot', ballotRouter);
app.use('/proxy', proxyRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
