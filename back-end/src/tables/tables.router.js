const router = require('express').Router();
const controller = require('./tables.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

// <--------------------------------------- Tables ROUTER ------------------------------------------->

router
  .route('/:table_id([0-9]+)/seat') // Validation for ":table_id" params
  .put(controller.updateSeatRes)
  .delete(controller.delete)
  .all(methodNotAllowed);

router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
