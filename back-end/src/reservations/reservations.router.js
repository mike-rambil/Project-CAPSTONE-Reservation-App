/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require('express').Router();
const methodNotAllowed = require('../errors/methodNotAllowed');
const controller = require('./reservations.controller');

// <--------------------------------------- Reservation ROUTER ------------------------------------------->

router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router.route('/new').post(controller.create).all(methodNotAllowed);

router
  .route('/:reservationId([0-9]+)') //validation for ':reservationId in params
  .get(controller.read)
  .put(controller.updateReservation)
  .all(methodNotAllowed);

router
  .route('/:reservationId([0-9]+)/status') //validation for ':reservationId in params
  .put(controller.updateStatus)
  .all(methodNotAllowed);

module.exports = router;
