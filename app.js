const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const passport = require('passport');
// const config = require('./config');

// Routes Variables
const index = require('./routes/index');
// const auth = require('./routes/auth');
// const jobs = require('./routes/jobs');
// const clients = require('./routes/clients');
// const admin = require('./routes/admin');


const app = express();
// Store cookies on mysql TODO: CHANGE
// const sessionStore = new MySQLStore({
//   host: config.mysqlConnection.server,
//   user: config.mysqlConnection.username,
//   port: config.mysqlConnection.port,
//   password: config.mysqlConnection.password,
//   database: config.mysqlConnection.database,
//   checkExpirationInterval: 300000, // Check for expired every 5 minutes
// });
// Trust proxy passes
app.set('trust_proxy', 1);
// app.use(session({
//   secret: config.misc.cookieSecret,
//   resave: false,
//   store: sessionStore,
//   saveUninitialized: true,
//   unset: 'destroy',
//   cookie: {
//     secure: config.misc.cookieSecure,
//   },
// }));
// Passport setup
// app.use(passport.initialize());
// app.use(passport.session());
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.disable('etag');
// app.use((req, res, next) => {
//   if (req.user) {
//       res.locals.firstname = req.user.firstname;
//       res.locals.lastname = req.user.lastname;
//       res.locals.email = req.user.email;
//       res.locals.profileurl = req.user.profileurl;
//       res.locals.lastlogin = req.user.lastlogin;
//     }
//   res.locals.company = config.companyInfo.companyName;
//   res.locals.version = require('./package.json').version;
//   next();
// });
// View static files in public folder
app.use(express.static(path.join(__dirname, 'public')));
// Checks if User is Loggined in and is not on login page or google auth
// app.use((req, res, next) => {
//   if (req.path === '/login' || req.path === '/bingbg' || req.path.indexOf('/auth/google') !== -1) {
//   next();
// } else if (req.user) {
// 			next();
// 		} else {
// 			if (req.path === '/') {
// 				res.redirect('/login');
// 			} else {
// 				res.redirect('/login?error=redirect');
// 			}
// 		}
// });
// Routes
app.use('/', index);
// app.use('/auth', auth);
// app.use('/jobs', jobs);
// app.use('/clients', clients);
// app.use('/admin', admin);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      title: err.status,
      status: err.status,
      message: err.message,
      error: err,
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: err.status,
    status: err.status,
    message: err.message,
    error: {},
  });
});
module.exports = app;
