import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ReservationForm from '../components/reservations/ReservationForm';
import ReservationSearch from '../components/reservations/ReservationSearch';
import ReservationSeat from '../components/reservations/ReservationSeat';
import TableCreate from '../components/tables/TableCreate';
import Dashboard from '../dashboard/Dashboard';
import { today } from '../utils/date-time';
import useQuery from '../utils/useQuery';
import NotFound from './NotFound';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());

  const url = useRouteMatch();
  const query = useQuery();

  // Get Date
  function getDate() {
    const date = query.get('date');
    if (date) {
      setDate(date);
    }
  }

  // GEt Date whenever URL/query changes
  useEffect(getDate, [url, query]);

  return (
    <Switch>
      {/* <--------------------------------------- Dashboard Route -----------------------------------------> */}
      <Route path='/dashboard'>
        <Dashboard date={date} />
      </Route>

      {/* <---------------------------------------- Reservation Routes -------------------------------------> */}

      <Route exact path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact path='/reservations/new'>
        <ReservationForm date={date} />
      </Route>
      <Route exact path='/search'>
        <ReservationSearch />
      </Route>
      <Route exact path='/reservations/:reservation_id/seat'>
        <ReservationSeat />
      </Route>
      <Route exact path='/reservations/:reservation_id/edit'>
        <ReservationForm date={date} isEditing={true} />
      </Route>

      {/* <------------------------------------------ Table Routes -------------------------------------------> */}

      <Route exact path='/tables'>
        <Dashboard date={date} />
      </Route>
      <Route exact path='/tables/new'>
        <TableCreate />
      </Route>

      {/* <-------------------------------------- Redirect '/' to Dashboard -----------------------------------> */}

      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>

      {/* <---------------------------------------- Not Found Handler ----------------------------------------> */}

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
