const express = require('express');
const GoogleAuth = require('google-auth-library');
const moment = require('moment');
// eslint-disable-next-line
const config = require('./../config');
const db = require('./../helpers/db/index');
const core = require('./../helpers/core');

const googleAPIClientID = config.google.apiClientID;
const secretTokenKey = config.secretTokenKey;

const googleAuth = new GoogleAuth();
const client = new googleAuth.OAuth2(googleAPIClientID, '', '');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Generate random token to include in JWT
function generateToken() {
  const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  const length = 50;
  return token.substring(0, length);
}

// Generate JWT with random token
function generateJWTToken(userId) {
  return new Promise((resolve, reject) => {
    const token = generateToken();
    const date = moment().startOf('week').add(7, 'days');
    const payload = {
      token,
      userId,
      exp: date.unix(),
    };
    const options = {
      algorithm: 'HS256',
    };
    jwt.sign(payload, secretTokenKey, options, (err, jwtToken) => {
      if (err) {
        reject(err);
      } else {
        db.insert({
          table: 'session',
          values: {
            token,
            userid: userId,
            expires: date.format('YYYY-MM-DD HH:mm:ss'),
          },
        }).then(() => {
          resolve({
            token: jwtToken,
            expires: date.toDate(),
          });
        }).catch((error) => {
          reject(error);
        });
      }
    });
  });
}

function createUser(res, userid, googleId, firstName, lastName, email, profilePicture) {
  // Create User
  db.insert({
    table: 'user',
    values: {
      googleid: googleId,
      firstname: firstName,
      lastname: lastName,
      email,
      profilepicture: profilePicture,
    },
  }).then(() => {
    generateJWTToken(userid).then((tokenJSON) => {
      // return jwtToken
      core.api.returnJSON(res, {
        token: tokenJSON.token,
        expiresIn: tokenJSON.expires,
      });
    }).catch(tokenError => core.api.returnError(res, 500, tokenError, 'logout'));
  });
}

function updateUser(res, userid, googleId, firstName, lastName, email, profilePicture) {
  // Update User infomation
  db.update({
    table: 'user',
    values: {
      firstname: firstName,
      lastname: lastName,
      email,
      profilepicture: profilePicture,
    },
    where: {
      googleid: googleId,
    },
  }).then(() => {
      // Generate JWT Token
    generateJWTToken(userid).then((tokenJSON) => {
      // return jwtToken
      core.api.returnJSON(res, {
        token: tokenJSON.token,
        expiresIn: tokenJSON.expires,
      });
    }).catch(tokenError => core.api.returnError(res, 500, tokenError, 'logout'));
  });
}

// ROUTES
// Check google token
router.post('/tokenrequest', (req, res) => {
  if (typeof req.body.googleToken !== 'undefined') {
    client.verifyIdToken(req.body.googleToken, googleAPIClientID, (err, login) => {
      if (err !== null) {
        // Error verifying token
        core.api.returnError(res, 500, 'Error in validating google token', 'logout');
      } else {
        const payload = login.getPayload();
        const domain = payload.hd; // If domain matches company Gsuite domain
        const googleId = payload.sub; // Store in database to check if user already exists
        if (domain === config.companyDomain) {
          // Add user to database and return new token
          const firstName = payload.given_name; // Store in database for later use
          const lastName = payload.family_name; // Store in database for later use
          const email = payload.email; // Store in database for later use
          const profilePicture = payload.picture; // Store in database for later use
          // See if users google ID exists in database already
          db.fetch({
            select: ['*'],
            table: 'user',
            where: [{
              col: 'googleid',
              value: googleId,
            }],
          }).then((value) => {
            if (value.length > 0) {
              // Existing user
              updateUser(res, value[0].id, googleId, firstName, lastName, email, profilePicture);
            } else {
              // create new user, new token
              createUser(res, value[0].id, googleId, firstName, lastName, email, profilePicture);
            }
          });
        } else {
          // Handle error for incorrect domain
          core.api.returnError(res, 401, 'Domain Incorrect', 'logout');
        }
      }
    });
  } else {
    core.api.returnError(res, 401, 'Supply Token', 'logout');
  }
});


module.exports = router;
