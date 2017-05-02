const express = require('express');
const core = require('./../../helpers/core');
const db = require('./../../helpers/db');
const viewClient = require('./view');
const createClient = require('./create');
const updateClient = require('./edit');
const deleteClient = require('./delete');

const router = express.Router();


// Index Clients
router.get('/', (req, res) => {
  // Amount of clients per page
  const minAmount = req.query.page || 1;
  // Amount of clients per page
  const maxAmount = 50;
  // Work out amount
  const amount = (minAmount - 1) * maxAmount;
  let clients;
  let query;
  if (req.query.q) {
    query = {
      table: 'client',
      select: ['client.id', 'name', 'phone', 'street', 'suburb', 'town', 'postcode', 'country'],
      where: [{
        col: 'client.name',
        value: req.query.q,
      }],
      limit: {
        offset: amount,
        amount: maxAmount,
      },
      join: [{
        type: 'LEFT JOIN',
        table: 'firstaddressview',
        col: 'client.id',
        value: 'clientid',
      }, {
        type: 'LEFT JOIN',
        table: 'address',
        col: 'addressid',
        value: 'address.id',
      }],
    };
  } else {
    query = {
      table: 'client',
      select: ['client.id', 'name', 'phone', 'street', 'suburb', 'town', 'postcode', 'country'],
      limit: {
        offset: amount,
        amount: maxAmount,
      },
      join: [{
        type: 'LEFT JOIN',
        table: 'firstaddressview',
        col: 'client.id',
        value: 'clientid',
      }, {
        type: 'LEFT JOIN',
        table: 'address',
        col: 'addressid',
        value: 'address.id',
      }],
    };
  }
  db.fetch(query).then((returnedClients) => {
    clients = returnedClients;
  }).then(() => db.fetch({
    table: 'client',
    count: ['id'],
  })).then((countedClients) => {
    core.api.returnJSON(res, {
      pages: parseInt(Math.ceil(countedClients[0]['count(`id`)'] / maxAmount), 10),
      total: parseInt(countedClients[0]['count(`id`)'], 10),
      data: clients,
    });
  })
  .catch((err) => {
    core.api.returnError(res, 500, err, 'allow');
  });
});

// GET Client and their address and contacts by id in URL
router.get('/:id', viewClient);

// Create Client
router.put('/', createClient);

// POST (Update) Client and their address and contacts by id in URL
router.post('/:id', updateClient);

// DELETE Client and their address and contacts by id in URL
router.delete('/:id', deleteClient);


module.exports = router;
