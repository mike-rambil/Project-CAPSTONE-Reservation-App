import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../../layout/ErrorAlert';
import { listTables, updateResStatus } from '../../utils/api';

function ReservationTable({ reservations }) {
  const history = useHistory();

  const [reservation, setReservation] = useState(reservations);
  const [error, setError] = useState(null);

  const cancelReservationHandler = async (event) => {
    event.preventDefault();
    setError(null);

    if (
      window.confirm(
        'Do you want to cancel this reservation? This cannot be undone.'
      )
    ) {
      try {
        await updateResStatus(
          { status: 'cancelled' },
          reservation.reservation_id
        );
        listTables();
        history.push('/dashboard');
      } catch (error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    setReservation(reservation);
  }, [reservation, history]);

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope='row'> {reservation.reservation_id} </th>
        <td> {reservation.first_name} </td>
        <td> {reservation.last_name} </td>
        <td> {reservation.people} </td>
        <td> {reservation.mobile_number} </td>
        <td> {reservation.reservation_date} </td>
        <td> {reservation.reservation_time} </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          <div>
            {reservation.status === 'booked' && (
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button className='btn btn-primary'> Seat </button>
              </a>
            )}{' '}
          </div>
        </td>
        <td>
          <div>
            {reservation.status === 'booked' && (
              <a href={`/reservations/${reservation.reservation_id}/edit`}>
                <button className='btn btn-primary '> Edit </button>
              </a>
            )}
          </div>
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          <div>
            {reservation.status === 'booked' && (
              <button
                className='btn btn-danger ml-2'
                onClick={cancelReservationHandler}
              >
                Cancel
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default ReservationTable;
