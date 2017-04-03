const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.static(path.resolve('./views')));

router.get(['/', '/#*'], (req, res) => {
  // res.send('Hello');
  res.sendFile(path.resolve('./views/index.html'));
});


module.exports = router;
