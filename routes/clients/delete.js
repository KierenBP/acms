const core = require('./../../helpers/core');
const db = require('./../../helpers/db');


function deleteClient(req, res) {
  const clientId = parseInt(req.params.id, 10);
  if (typeof clientId === 'number') {
    db.update({
      table: 'client',
      values: {
        archive: true,
      },
      where: {
        id: clientId,
      },
    })
      .then(() => core.api.returnJSON(res, {
        data: {
          id: clientId,
        },
      }))
      .catch(err => core.api.returnError(res, 500, err, 'allow'));
  } else {
    core.api.returnError(res, 400, 'Client ID Required', 'allow');
  }
}

module.exports = deleteClient;
