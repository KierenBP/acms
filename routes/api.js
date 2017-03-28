const express = require('express');
const request = require('request');
const auth = require('./../helpers/auth');
const tools = require('./../helpers/tools');
const core = require('./../helpers/core');


const clients = require('./clients');

const router = express.Router();

// Bing Background
// No Auth required
router.use('/bingbg', (req, res) => {
  const newurl = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';
  request(newurl).pipe(res);
});

// Auth check
// This must be before any router requests as they will NOT be authenticated otherwise
// router.use(auth.checkHeaders);


router.get('/', (req, res) => {
  core.api.returnJSON(res, {
    info: {
      version: tools.version.getVersionNumber(),
      latestCommit: tools.version.getCommitSHA(),
    },
    user: res.locals.user,
  });
});


router.use('/clients', clients);


module.exports = router;
