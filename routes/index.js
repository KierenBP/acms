const express = require('express');
const request = require('request');

const router = express.Router();
// const connection = require('./../helpers/db').connection;
// const config = require('./../config');
router.use('/bingbg', (req, res) => {
  const newurl = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';
  request(newurl).pipe(res);
});
// // GET Login page.
// router.get('/login',
//     function(req, res) {
//         if (req.query.error === 'failed') {
//             res.locals.flash = {
//                 type: 'error',
//                 message: 'Failed to authenticate with Google'
//             };
//         } else if (req.query.error === 'redirect') {
//             res.locals.flash = {
//                 type: 'error',
//                 message: 'You must login to contiune'
//             };
//         }
//         res.render('login', {
//             title: 'Login',
//             google_apps_email: config.companyInfo.domain // jshint ignore: line
//         });
//     });
// // GET Logout Page.
// router.get('/logout',
//     function(req, res) {
//         req.logout();
//         res.redirect('/login');
//     });
// GET home page.
router.get('/', (req, res) => {
  res.send('Hello');
});
module.exports = router;
