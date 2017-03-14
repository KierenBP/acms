const core = require('./../../helpers/core');
const db = require('./../../helpers/db');

function viewClients(req, res) {
  // Client ID from request param `id`
  const clientId = req.query.id;

  // Global variables for client, client addresses and client contacts
  let client;
  let addressList;
  let contactList;

  db.fetch({
    table: 'client',
    select: ['*'],
    where: [{
      col: 'id',
      value: clientId,
    }],
  }).then((returnedClient) => {
    client = returnedClient[0];
  })
    .then(() => db.fetch({
      table: 'contactview',
      select: ['*'],
      where: [{
        col: 'clientid',
        value: clientId,
      }],
    }))
    .then((clientContacts) => {
      contactList = clientContacts;
    })
    .then(() => db.fetch({
      table: 'addressview',
      select: ['*'],
      where: [{
        col: 'clientid',
        value: clientId,
      }],
      orderby: [{
        col: 'sequence',
        order: 'asc',
      }],
    }))
    .then((clientAddresses) => {
      addressList = clientAddresses;
    })
    .then(() => {
      // Combine the addresses and contacts into the returned client object
      client.contacts = contactList;
      client.addresses = addressList;
      core.api.returnJSON(res, {
        data: client,
      });
    })
    .catch((err) => {
      core.api.returnError(res, 500, err, 'allow');
    });
}

module.exports = viewClients;
