const tools = require('./tools');

const version = tools.version.getVersionNumber();

const core = {
  api: {
    returnJSON: (res, data) => {
      res.set({
        Auth: 'allow',
        Version: version,
        'X-Powered-By': 'A lot of coffee', // ☕️
      });
      res.json(data);
    },
    returnError: (res, status, data, auth) => {
      res.status(status);
      res.set({
        Auth: auth.toLowercase(),
        Version: version,
        'X-Powered-By': 'A lot of crying', // ☕️
      });
      res.json(data);
    },
  },
};

module.exports = core;
