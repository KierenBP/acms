const jwt = require('jsonwebtoken');
// eslint-disable-next-line
const config = require('./../config');
const db = require('./db/index');

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
            resolve();
          } else {
            // Token Doesn't exist
            reject();
          }
        }).catch(error => reject(error));
      }
    });
  });
}

module.exports = {
  checkToken,
};
