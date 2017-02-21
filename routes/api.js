const express = require('express');
const auth = require('./../helpers/auth');
const tools = require('./../helpers/tools');

const router = express.Router();

// Auth check
router.use(auth.checkHeaders);


router.get('/', (req, res) => {
  res.json({
    info: {
      version: tools.version.getVersionNumber(),
      latestCommit: tools.version.getCommitSHA(),

    },
    user: res.locals.user,
  });
});

module.exports = router;
