const tools = require('./tools');

const version = tools.version.getVersionNumber();

const core = {
  api: {
    returnJSON: (res, data) => {
      res.set({
        Auth: 'allow',
        Version: version,
        'X-Powered-By': 'A lot of coffee', // ☕️
        'Access-Control-Allow-Origin': 'http://kieren.dev:8080',
      });
      res.json(data);
    },
    returnError: (res, status, error, auth) => {
      console.log(error);
      res.status(status);
      res.set({
        Auth: auth.toString().toLowerCase(),
        Version: version,
        'X-Powered-By': 'A lot of crying', // 😭
        'Access-Control-Allow-Origin': 'http://kieren.dev:8080',
      });
      res.json({
        error,
      });
    },
  },
};

module.exports = core;
