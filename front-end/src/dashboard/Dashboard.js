import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ReservationTable from '../components/reservations/ReservationTable';
import TableList from '../components/tables/TableList';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations, listTables } from '../utils/api';
import { next, previous } from '../utils/date-time';

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);

  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const history = useHistory();
  const location = useLocation();
  const searchedDate = location.search.slice(-10);

  // OnClick Submit Handlers

  const handleLastDaySubmit = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(previous(currentDate));
  };

  const handleTodaySubmit = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(date);
  };

  const handleNextDaySubmit = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(next(currentDate));
  };

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if (currentDate === date) {
          const returnedReservations = await listReservations(
            { date },
            abortController.signal
          );
          setReservations(returnedReservations);
        } else {
          const returnedReservations = await listReservations(
            { currentDate },
            abortController.signal
          );
          setReservations(returnedReservations);
        }
      } catch (error) {
        setError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location]);

  useEffect(() => {
    if (searchedDate && searchedDate !== '') {
      setCurrentDate(searchedDate);
    }
  }, [searchedDate, history]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      try {
        const receivedTables = await listTables();
        setTables(receivedTables);
      } catch (error) {
        setError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [history, date, currentDate]);

  return (
    <div>
      <div className='mb-4'>
        <h1>Dashboard</h1>
      </div>

      <div className='d-md-flex mb-4'>
        <div className='row mb-4'>
          <div>
            <button
              onClick={handleLastDaySubmit}
              className='btn btn-primary ml-4'
            >
              Previous Day
            </button>
          </div>
          <div>
            <button
              onClick={handleTodaySubmit}
              className='btn btn-primary ml-4'
            >
              Today
            </button>
          </div>
          <div className=''>
            <button
              onClick={handleNextDaySubmit}
              className='btn btn-primary ml-4'
            >
              Next Day
            </button>
          </div>
        </div>
      </div>
      <ErrorAlert error={error} />
      <div>
        <h4> Reservation Table </h4>
        <table className='table '>
          <thead>
            <tr>
              <th> ID </th>
              <th> First Name </th>
              <th> Last Name </th>
              <th> Party Size </th>
              <th> Phone Number </th>
              <th> Date </th>
              <th> Time </th>
              <th> Status </th>
              <th> Seat </th>
              <th> Edit </th>
              <th> Cancel </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <ReservationTable
                reservations={reservation}
                key={reservation.reservation_id}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4> Tables </h4>
        <table className='table '>
          <thead>
            <tr>
              <th> ID </th>
              <th> Table Name </th>
              <th> Capacity </th>
              <th> Reservation ID </th>
              <th> Table Status </th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <TableList key={table.table_id} table={table} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
