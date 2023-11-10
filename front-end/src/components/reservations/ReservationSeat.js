import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ErrorAlert from '../../layout/ErrorAlert';
import { listTables, updateSeat } from '../../utils/api';

function ReservationSeat() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [data, setTable] = useState({});

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const abortController = new AbortController();

      try {
        setError(null);
        const tablesData = await listTables();
        setTables(tablesData);
      } catch (err) {
        setError(err);
      } finally {
        abortController.abort();
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedTableData = JSON.parse(data);

    try {
      const response = await updateSeat(
        parsedTableData.table_id,
        reservation_id
      );
      const tablesDATA = tables.map((table) =>
        table.table_id === response.table_id ? response : table
      );
      setTables(tablesDATA);
      history.push('/dashboard');
    } catch (error) {
      setError(error);
    }
  };

  if (tables) {
    return (
      <>
        <div className='mb-4'>
          <h2> Find table for Current Reservation </h2>
        </div>
        <ErrorAlert error={error} />
        <div className='mb-4'>
          <h3> Current Reservation: {reservation_id} </h3>
        </div>

        <form className='form-group' onSubmit={handleSubmit}>
          <div className='col mb-4'>
            <label className='form-label' htmlFor='table_id'>
              Select Table
            </label>
            <select
              id='table_id'
              className='form-control'
              name='table_id'
              onChange={(event) => setTable(event.target.value)}
            >
              <option value=''> Table Name </option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={JSON.stringify(table)}
                  required={true}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <button
            type='button'
            onClick={() => history.goBack()}
            className='btn btn-secondary mr-2'
          >
            Cancel
          </button>
          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </form>
      </>
    );
  } else {
    return (
      <div>
        <h2> No tables left! </h2>
      </div>
    );
  }
}

export default ReservationSeat;
