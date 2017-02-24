const express = require('express');
const auth = require('./../helpers/auth');
const tools = require('./../helpers/tools');
const core = require('./../helpers/core');

const router = express.Router();

// Auth check
// This must be before any router requests as they will NOT be authenticated otherwise
router.use(auth.checkHeaders);


router.get('/', (req, res) => {
  res.json(core.api.returnJSON({
    info: {
      version: tools.version.getVersionNumber(),
      latestCommit: tools.version.getCommitSHA(),

    },
    user: res.locals.user,
  }));
});

module.exports = router;
