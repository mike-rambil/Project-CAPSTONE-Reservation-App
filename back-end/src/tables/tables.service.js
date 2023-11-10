const knex = require('../db/connection');

function create(newTable) {
  return knex('tables')
    .insert({
      ...newTable,
      table_status: newTable.reservation_id ? 'occupied' : 'free',
    })
    .returning('*')
    .then((result) => result[0]);
}

function read(table_id) {
  return knex('tables')
    .leftJoin(
      'reservations',
      'reservations.reservation_id',
      'tables.reservation_id'
    )
    .select(
      'tables.table_id',
      'tables.table_name',
      'tables.capacity',
      'tables.reservation_id',
      'reservations.first_name',
      'reservations.last_name',
      'reservations.mobile_number',
      'reservations.reservation_date',
      'reservations.reservation_time',
      'reservations.people',
      'reservations.status',
      'reservations.created_at as reservation_created',
      'reservations.updated_at as reservation_updated'
    )
    .where({ table_id })
    .then((result) => result[0]);
}

function readTable(table_id) {
  return knex('tables').select('*').where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex('reservations').select('*').where({ reservation_id }).first();
}

function list() {
  return knex('tables').select('*').orderBy('table_name');
}

function findTableViaReservation(reservation_id) {
  return knex('tables')
    .where({ reservation_id })
    .whereExists(knex.select('*').from('tables').where({ reservation_id }))
    .then((result) => result[0]);
}

async function updateSeatReservation(reservation_id, table_id) {
  const trx = await knex.transaction();
  return trx('tables')
    .where({ table_id })
    .update(
      {
        reservation_id: reservation_id,
        table_status: 'occupied',
      },
      '*'
    )
    .then(() =>
      trx('reservations').where({ reservation_id }).update({ status: 'seated' })
    )
    .then(trx.commit)
    .catch(trx.rollback);
}

async function removeTable(table_id, reservation_id) {
  const trx = await knex.transaction();
  return trx('tables')
    .where({ table_id })
    .update(
      {
        reservation_id: null,
        table_status: 'free',
      },
      '*'
    )
    .then(() =>
      trx('reservations')
        .where({ reservation_id })
        .update({ status: 'finished' }, '*')
    )
    .then(trx.commit)
    .catch(trx.rollback);
}

module.exports = {
  create,
  list,
  read,
  readTable,
  findTableViaReservation: findTableViaReservation,
  readReservation,
  removeTable: removeTable,
  updateSeatReservation: updateSeatReservation,
};
