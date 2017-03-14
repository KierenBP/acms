const core = require('./../../helpers/core');
const db = require('./../../helpers/db');

function createContacts(id, contactArray) {
  return new Promise((resolve, reject) => {
    if (contactArray.length === 0) {
      resolve();
    } else {
      for (let i = 0; i < contactArray.length; i += 1) {
        const contact = contactArray[i];
        db.insert({
          table: 'contact',
          values: {
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email,
          },
        }).then(insertValues => db.insert({
          table: 'client_contact',
          values: {
            clientid: id,
            contactid: insertValues.insertId,
            sequence: i,
            emailinclude: contact.emailinclude,
          },
        }))
      .then(() => resolve())
    .catch(err => reject(err));
      }
    }
  });
}

function createAddresses(id, addressArray) {
  return new Promise((resolve, reject) => {
    if (addressArray.length === 0) {
      resolve();
    } else {
      for (let i = 0; i < addressArray.length; i += 1) {
        const address = addressArray[i];
        db.insert({
          table: 'address',
          values: {
            street: address.street,
            suburb: address.suburb,
            town: address.town,
            postcode: address.postcode,
            country: address.country,
            addresstype: address.addresstype,
          },
        }).then(insertValues => db.insert({
          table: 'client_address',
          values: {
            clientid: id,
            addressid: insertValues.insertId,
            sequence: i,
          },
        }))
      .then(() => resolve())
    .catch(err => reject(err));
      }
    }
  });
}

function createClient(req, res) {
  const body = req.body;
  let clientId;
  db.insert({
    table: 'client',
    values: {
      name: body.name,
      phone: body.phone,
      fax: body.fax,
      mobile: body.mobile,
      website: body.website,
      accountnumber: body.accountnumber,
    },
  }).then((insertValues) => {
    clientId = insertValues.insertId;
  })
  .then(() => createContacts(clientId, body.contacts))
  .then(() => createAddresses(clientId, body.addresses))
  .then(() => core.api.returnJSON(res, {
    data: {
      id: clientId,
    },
  }))
  .catch(err => core.api.returnError(res, 500, err, 'allow'));
}

module.exports = createClient;
