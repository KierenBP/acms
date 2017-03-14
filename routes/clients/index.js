const express = require('express');
const core = require('./../../helpers/core');
const db = require('./../../helpers/db');
const viewClient = require('./view');
const createClient = require('./create');

const router = express.Router();

// Create Client
router.put('/', createClient);


router.get('/', (req, res) => {
  // Amount of clients per page
  const minAmount = req.query.page || 1;
  // Amount of clients per page
  const maxAmount = 50;
  // Work out amount
  const amount = (minAmount - 1) * maxAmount;
  let clients;
  db.fetch({
    table: 'client',
    select: ['id', 'name'],
    limit: {
      offset: amount,
      amount: maxAmount,
    },
  }).then((returnedClients) => {
    clients = returnedClients;
  }).then(() => db.fetch({
    table: 'client',
    count: ['id'],
  })).then((countedClients) => {
    core.api.returnJSON(res, {
      pages: parseInt(Math.ceil(countedClients[0]['count(`id`)'] / maxAmount), 10),
      data: clients,
    });
  })
  .catch((err) => {
    core.api.returnError(res, 500, err, 'allow');
  });
});

// GET Client and their address and contacts by id in URL
router.get('/:id', viewClient);

// POST (Update) Client and their address and contacts by id in URL
// router.post('/:id', updateClient);

// DELETE Client and their address and contacts by id in URL
// router.delete('/:id', deleteClient);


module.exports = router;
