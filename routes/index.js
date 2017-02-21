const express = require('express');
const request = require('request');

const router = express.Router();

router.use('/bingbg', (req, res) => {
  const newurl = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';
  request(newurl).pipe(res);
});
router.get('/', (req, res) => {
  res.send('Hello');
});
module.exports = router;
