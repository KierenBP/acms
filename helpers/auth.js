const jwt = require('jsonwebtoken');
// eslint-disable-next-line
const config = require('./../config');
const db = require('./db/index');
const core = require('./core');

const secretTokenKey = config.secretTokenKey;


// Check if token is legit and in database and not expired
function checkToken(jwtToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, secretTokenKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        db.fetch({
          table: 'session',
          select: ['*'],
          where: [{
            col: 'token',
            value: decoded.token,
          },
          {
            col: 'userid',
            value: decoded.userId,
          }],
        }).then((value) => {
          if (value.length > 0) {
            // Token found!
            resolve(decoded.userId);
          } else {
            // Token Doesn't exist
            reject('Please login again');
          }
        }).catch(error => reject(error));
      }
    });
  });
}

// Extract token from Bearer authentication header
function extractToken(bearer) {
  const bearerArray = bearer.split(' ');
  if (bearerArray[0] === 'Bearer' && bearerArray.length <= 2) {
    return bearerArray[1];
  }
  return false;
}


function checkHeaders(req, res, next) {
  const authHeader = req.get('Token');
  if (authHeader !== undefined) {
    checkToken(authHeader).then((userId) => {
      res.locals.user = {  // eslint-disable-line no-param-reassign
        userId,
      };
      next();
    }).catch((err) => {
      core.api.returnError(res, 401, err, 'logout');
    });
  } else {
    core.api.returnError(res, 401, 'Token header not supplied', 'logout');
  }
}


module.exports = {
  checkToken,
  checkHeaders,
};
