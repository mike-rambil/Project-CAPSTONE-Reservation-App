import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { listReservations } from '../../utils/api';

import ReservationTable from './ReservationTable';

function ReservationSearch() {
  const history = useHistory();

  const [reservations, setReservations] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('No reservations found');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await listReservations({ mobile_number: phoneNumber });
      setReservations(res);
      history.push('/search');
    } catch (error) {
      setError('No reservations found');
    }
  };

  return (
    <>
      <div className='mb-4'>
        <h1> Find your Reservation! </h1>
      </div>
      <div>
        <form className='form-group mb-4' onSubmit={handleSubmit}>
          <input
            placeholder="Enter customer's phone number"
            name='mobile_number'
            type='search'
            className='form-control rounded mb-2'
            onChange={(event) => setPhoneNumber(event.target.value)}
            value={phoneNumber}
          />
          <div>
            <button type='submit' className='btn btn-primary'>
              Find
            </button>
          </div>
        </form>
      </div>
      {reservations && reservations.length ? (
        <div>
          <h4 className='mb-4'> Search Results </h4>
          <table className='table '>
            <thead>
              <th> ID </th>
              <th> First Name </th>
              <th> Last Name </th>
              <th> No: of people </th>
              <th> Phone Number </th>
              <th> Reservation Date </th>
              <th> Reservation Time </th>
              <th> Reservation Status </th>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <ReservationTable reservations={reservation} key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <small>Search Results or Errors Occur here!</small>
          <p className='alert alert-danger'> {error} </p>
        </>
      )}
    </>
  );
}
export default ReservationSearch;
