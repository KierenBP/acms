const express = require('express');
const GoogleAuth = require('google-auth-library');
// eslint-disable-next-line
const config = require('./../config');
const db = require('./../helpers/db/index');
const core = require('./../helpers/core');

const googleAPIClientID = config.google.apiClientID;
const secretTokenKey = config.secretTokenKey;

const auth = new GoogleAuth();
const client = new auth.OAuth2(googleAPIClientID, '', '');
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
    const expiresIn = Math.floor(Date.now() / 1000) + 86400;
    const payload = {
      token,
      userId,
    };
    const options = {
      expiresIn,
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
            expires: expiresIn,
          },
        }).then(() => {
          resolve({
            token: jwtToken,
            expires: expiresIn });
        }).catch((error) => {
          reject(error);
        });
      }
    });
  });
}

// Check google token
router.post('/tokenrequest', (req, res) => {
  if (typeof req.body.googleToken !== 'undefined') {
    client.verifyIdToken(req.body.googleToken, googleAPIClientID, (err, login) => {
      if (err !== null) {
        // Error verifying token
        res.status(400).json({
          status: 'Error',
          message: 'Verifying token failed',
          logout: true,
          data: {
            message: err,
          },
        });
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
                generateJWTToken(value[0].id).then((tokenJSON) => {
                  // return jwtToken
                  res.json({
                    token: tokenJSON.token,
                    expiresIn: tokenJSON.expires,
                  });
                }).catch(tokenError => res.status(400).json({
                  status: 'Error',
                  message: 'Error during token generation',
                  logout: true,
                  data: tokenError,
                }));
              });
            } else {
              // create new user, new token
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
                generateJWTToken(value[0].id).then((tokenJSON) => {
                  // return jwtToken
                  res.json({
                    token: tokenJSON.token,
                    expiresIn: tokenJSON.expires,
                  });
                }).catch(tokenError => res.status(400).json({
                  status: 'Error',
                  message: 'Error during token generation',
                  logout: true,
                  data: tokenError,
                }));
              });
            }
          });
        } else {
          // Handle error
          res.status(400).json(core.api.returnError());
        }
      }
    });
  } else {
    res.status(400).json({
      status: 'Error',
      message: 'Supply token',
      logout: true,
      data: {},
    });
  }
});


module.exports = router;
