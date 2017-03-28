const core = require('./../../helpers/core');
const db = require('./../../helpers/db');


function deleteContact(clientid, contactid) {
  return db.remove({
    table: 'client_contact',
    where: {
      contactid,
    },
  }).then(() => db.remove({
    table: 'contact',
    where: {
      id: contactid,
    },
  }));
}


function deleteAddress(clientid, addressid) {
  return db.remove({
    table: 'client_address',
    where: {
      addressid,
    },
  }).then(() => db.remove({
    table: 'address',
    where: {
      id: addressid,
    },
  }));
}


function editAddresses(id, addressArray) {
  return new Promise((resolve, reject) => {
    if (addressArray !== undefined) {
      db.fetch({
        table: 'addressview',
        select: ['addressid', 'street', 'suburb', 'town', 'postcode', 'country', 'addresstype', 'sequence'],
        where: [{
          col: 'clientid',
          value: id,
        }],
      }).then((existingArray) => {
        for (let i = 0; i < addressArray.length; i++) {
          const element = addressArray[i];

        // Update sequence
          element.sequence = i;

        // Check if new contact
          if (element.id === undefined) {
            db.insert({
              table: 'address',
              values: {
                street: element.street,
                suburb: element.suburb,
                town: element.town,
                postcode: element.postcode,
                country: element.country,
                addresstype: element.addrestype,
              },
            })
          .then(newAddress => db.insert({
            table: 'client_address',
            values: {
              clientid: id,
              addressId: newAddress.insertId,
              sequence: element.sequence,
            },
          })).catch(err => reject(err));
          } else {
            let existingIndex = -1;
            for (let x = 0; x < existingArray.length; x++) {
              if (existingArray[x].id === element.id) {
                existingIndex = x;
                break;
              }
            }
            db.update({
              table: 'address',
              values: {
                street: element.street,
                suburb: element.suburb,
                town: element.town,
                postcode: element.postcode,
                country: element.country,
                addresstype: element.addrestype,
              },
              where: {
                id: element.id,
              },
            }).then(() => db.update({
              table: 'client_address',
              values: {
                sequence: element.sequence,
              },
              where: {
                clientid: id,
                contactid: element.id,
              },
            }))
          .then(() => {
            // delete existingIndex
            if (existingIndex > -1) {
              existingArray.splice(existingIndex, 1);
            }
            let z = existingArray.length;
            while (z--) {
              deleteAddress(id, existingArray[z].contactid)
                .catch(err => reject(err));
            }
          }).catch(err => reject(err));
          }
        }
      })
    .then(() => resolve());
    } else {
      resolve();
    }
  });
}

function editContacts(id, contactArray) {
  return new Promise((resolve, reject) => {
    if (contactArray !== undefined) {
      db.fetch({
        table: 'contactview',
        select: ['contactid', 'firstname', 'lastname', 'email', 'sequence', 'emailinclude'],
        where: [{
          col: 'clientid',
          value: id,
        }],
      }).then((existingArray) => {
        for (let i = 0; i < contactArray.length; i++) {
          const element = contactArray[i];

        // Update sequence
          element.sequence = i;

        // Check if new contact
          if (element.id === undefined) {
            db.insert({
              table: 'contact',
              values: {
                firstname: element.firstname,
                lastname: element.lastname,
                email: element.email,
              },
            }).then(newContact => db.insert({
              table: 'client_contact',
              values: {
                clientid: id,
                contactid: newContact.insertId,
                sequence: element.sequence,
                emailinclude: element.emailinclude,
              },
            })).catch(err => reject(err));
          } else {
            let existingIndex = -1;
            for (let x = 0; x < existingArray.length; x++) {
              if (existingArray[x].id === element.id) {
                existingIndex = x;
                break;
              }
            }
            db.update({
              table: 'contact',
              values: {
                firstname: element.firstname,
                lastname: element.lastname,
                email: element.email,
              },
              where: {
                id: element.id,
              },
            }).then(() => db.update({
              table: 'client_contact',
              values: {
                sequence: element.sequence,
                emailinclude: element.emailinclude,
              },
              where: {
                clientid: id,
                contactid: element.id,
              },
            }))
          .then(() => {
            // delete existingIndex
            if (existingIndex > -1) {
              existingArray.splice(existingIndex, 1);
            }
            let z = existingArray.length;
            while (z--) {
              deleteContact(id, existingArray[z].contactid)
                .catch(err => reject(err));
            }
          }).catch(err => reject(err));
          }
        }
      })
    .then(() => resolve());
    } else {
      resolve();
    }
  });
}

function editClient(req, res) {
  const body = req.body;
  const clientId = parseInt(req.params.id, 10);
  if (typeof clientId === 'number') {
    const values = {};
    // Add only changed client values into value object
    const clientInfoKeys = [{
      name: 'name',
      prop: body.name,
    }, {
      name: 'phone',
      prop: body.phone,
    }, {
      name: 'fax',
      prop: body.fax,
    }, {
      name: 'mobile',
      prop: body.mobile,
    }, {
      name: 'website',
      prop: body.website,
    }, {
      name: 'accountnumber',
      prop: body.accountnumber,
    }, {
      name: 'archive',
      prop: false,
    }];
    for (let i = 0; i < clientInfoKeys.length; i++) {
      const element = clientInfoKeys[i];
      if (element.prop !== undefined) {
        values[element.name] = element.prop;
      }
    }

    db.update({
      table: 'client',
      values,
      where: {
        id: clientId,
      },
    })
    .then(() => editContacts(clientId, body.contacts))
    .then(() => editAddresses(clientId, body.addresses))
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

module.exports = editClient;
