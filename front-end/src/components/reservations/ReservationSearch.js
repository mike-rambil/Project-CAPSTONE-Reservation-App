import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { listReservations } from '../../utils/api';

import ReservationTable from './ReservationTable';

function ReservationSearch() {
  const history = useHistory();
  const [reservations, setReservations] = useState(null);
  const [mobile_number, setMobile_number] = useState('');
  const [error, setError] = useState('No reservations found');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await listReservations({ mobile_number });
      setReservations(res);
      history.push('/search');
    } catch (error) {
      setError('No reservations found');
    }
  };

  return (
    <>
      <div className='mb-3'>
        <h1> Find Reservation </h1>
      </div>

      <form className='form-group mb-3' onSubmit={handleSubmit}>
        <input
          type='search'
          name='mobile_number'
          className='form-control rounded mb-2'
          placeholder="Enter a customer's phone number"
          onChange={(event) => setMobile_number(event.target.value)}
          value={mobile_number}
        />
        <div>
          <button type='submit' className='btn btn-primary'>
            {' '}
            find{' '}
          </button>
        </div>
      </form>
      <br />
      {reservations && reservations.length ? (
        <div>
          <h3 className='mb-3'> Matching Reservations </h3>
          <table className='table table-striped'>
            <thead>
              <th scope='col'> Reservation ID </th>
              <th scope='col'> First Name </th>
              <th scope='col'> Last Name </th>
              <th scope='col'> People Size </th>
              <th scope='col'> Phone Number </th>
              <th scope='col'> Reservation Date </th>
              <th scope='col'> Reservation Time </th>
              <th scope='col'> Reservation Status </th>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <ReservationTable reservations={reservation} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <p className='alert alert-danger'> {error} </p>
        </>
      )}
    </>
  );
}

export default ReservationSearch;
