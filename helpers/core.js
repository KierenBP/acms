const tools = require('./tools');

const version = tools.version.getVersionNumber();

const core = {
  api: {
    returnJSON: data => ({
      status: 200,
      version,
      message: null,
      auth: 'allow',
      data,
    }),
    returnError: (status, message, auth) => ({
      status: 200,
      version,
      message,
      auth,
      data: null,
    }),
  },
};

module.exports = core;
