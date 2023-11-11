import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from '../../layout/ErrorAlert';
import { createTable } from '../../utils/api';

function TableCreate() {
  const [error, setError] = useState(null);
  const [table, setTable] = useState({
    table_name: '',
    capacity: '',
  });

  const history = useHistory();

  const handleChange = ({ target }) => {
    setTable({
      ...table,
      [target.name]: target.value,
    });
  };

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const pureTable = {
  //     ...table,
  //     capacity: Number(table.capacity),
  //   };
  //   await createTable(pureTable)
  //       history.push(`/dashboard`);
  //     })
  //     .catch(setError);
  // }

  async function handleSubmit(event) {
    event.preventDefault();
    const pureTable = {
      ...table,
      capacity: Number(table.capacity),
    };
    try {
      await createTable(pureTable);
      history.push(`/dashboard`);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <section>
      <h1> Create a Table </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className='form-group'>
        <div className='row mb-4'>
          <div className='col-4 form-group'>
            <label className='form-label' htmlFor='table_name'>
              {' '}
              Table Name{' '}
            </label>
            <input
              id='table_name'
              type='text'
              className='form-control'
              name='table_name'
              value={table.table_name}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className='col-4 form-group'>
            <label className='form-label' htmlFor='capacity'>
              {' '}
              Table Capacity{' '}
            </label>
            <input
              className='form-control'
              type='number'
              name='capacity'
              id='capacity'
              onChange={handleChange}
              value={table.capacity}
              required={true}
            />
          </div>
        </div>
        <button
          className='btn btn-secondary mr-4'
          type='button'
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </section>
  );
}

export default TableCreate;
