const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// <--------------------------- Tables Validation Checkers (line 5-158) --------------------------->

function hasDataProperty(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: 'Body must have a data property!',
  });
}

function hasReservationIdProperty(req, res, next) {
  const reservation = req.body.data.reservation_id;
  if (reservation) {
    return next();
  }
  next({
    status: 400,
    message: 'reservation_id required',
  });
}

function hasTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name) {
    return next();
  }
  next({
    status: 400,
    message: 'table_name property required',
  });
}

function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: 'table_name must be longer than 2 characters.',
  });
}

function hasValidTableCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity >= 1) {
    return next();
  }
  next({
    status: 400,
    message: 'Table must be able to seat at least 1 person!.',
  });
}

function hasValidCapacity(req, res, next) {
  if (!req.body.data.table_name || req.body.data.table_name === '') {
    return next({
      status: 400,
      message: "'table_name' field must not be empty!",
    });
  }
  if (req.body.data.table_name.length < 2) {
    return next({
      status: 400,
      message: "'table_name' field must contain at least 2 characters",
    });
  }
  if (!req.body.data.capacity || req.body.data.capacity === '') {
    return next({ status: 400, message: "'capacity' field cannot be empty" });
  }
  if (typeof req.body.data.capacity !== 'number') {
    return next({ status: 400, message: "'capacity' field must be a number" });
  }
  if (req.body.data.capacity < 1) {
    return next({
      status: 400,
      message: "'capacity' field must be at least higher than 0",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(
    req.body.data.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${req.body.data.reservation_id} does not exist`,
  });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.readTable(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `table_id ${table_id} does not exist`,
  });
}

async function reservationSeated(req, res, next) {
  const seated = await service.findTableViaReservation(
    req.body.data.reservation_id
  );
  if (!seated) {
    return next();
  }
  next({
    status: 400,
    message: 'reservation_id is already seated',
  });
}

function tableOccupiedChecker(req, res, next) {
  const { table } = res.locals;
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `table_id is occupied`,
  });
}

function tableOccupiedCheckerForOccupiedField(req, res, next) {
  const { table } = res.locals;
  if (table.table_status === 'occupied') {
    return next();
  }
  next({
    status: 400,
    message: 'table_id is not occupied',
  });
}

async function hasEnoughSeats(req, res, next) {
  const { reservation, table } = res.locals;
  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: 'table capacity is smaller than reservation size',
    });
  }
  return next();
}

// <--------------------------- Tables Controller functions --------------------------->
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function read(req, res) {
  const data = res.locals.table;
  res.json({ data });
}

async function create(req, res) {
  const newTable = req.body.data;
  const data = await service.create(newTable);
  res.status(201).json({ data });
}

async function updateSeatRes(req, res) {
  const { reservation, table } = res.locals;
  const data = await service.updateSeatReservation(
    reservation.reservation_id,
    table.table_id
  );
  res.json({ data });
}

async function destroy(req, res) {
  const { table } = res.locals;
  await service.removeTable(table.table_id, table.reservation_id);
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasDataProperty,
    hasTableName,
    hasValidCapacity,
    hasValidTableCapacity,
    validTableName,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  updateSeatRes: [
    hasDataProperty,
    hasReservationIdProperty,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableOccupiedChecker,
    asyncErrorBoundary(hasEnoughSeats),
    asyncErrorBoundary(reservationSeated),
    asyncErrorBoundary(updateSeatRes),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableOccupiedCheckerForOccupiedField,
    asyncErrorBoundary(destroy),
  ],
};
