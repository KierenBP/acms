const express = require('express');
const GoogleAuth = require('google-auth-library');
// eslint-disable-next-line
const config = require('./../config');
const db = require('./../helpers/db/index');

const googleAPIClientID = config.google.apiClientID;
const auth = new GoogleAuth();
const client = new auth.OAuth2(googleAPIClientID, '', '');

const router = express.Router();

// Check google token
router.use('/tokenrequest', (req, res) => {
  client.verifyIdToken(req.body.googleToken, googleAPIClientID, (err, login) => {
    if (err !== null) {
     // Error verifying token
      console.log('Error ', err);
    } else {
      const payload = login.getPayload();
      const domain = payload.hd; // If domain matches company Gsuite domain
      const userId = payload.sub; // Store in database to check if user already exists
      if (domain !== config.companyDomain) {
        res.json({
          failed: true,
        });
      } else {
        // Add user to database and return new token
        const firstName = payload.given_name; // Store in database for later use
        const lastName = payload.family_name; // Store in database for later use
        const email = payload.email; // Store in database for later use
        const profilePicture = payload.picture; // Store in database for later use
        db.fetch({
          select: ['*'],
          table: 'user',
          where: [{
            col: 'userid',
            value: userId,
          }],
        }).then((value) => {
          if (value.length > 0) {
           // existing user, new token and update infomation
          } else {
          // create new user, new token
          }
        });
      }
    }
  });
});

module.exports = router;
