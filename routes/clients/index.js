const express = require('express');
const core = require('./../../helpers/core');
const db = require('./../../helpers/db');

const router = express.Router();


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

module.exports = router;
