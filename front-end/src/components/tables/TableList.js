import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../../layout/ErrorAlert';
import {
  updateResStatus as changeResStat,
  deleteTableReservation,
  listTables,
} from '../../utils/api';

function TableList({ table }) {
  const [thisTable, setThisTable] = useState(table);
  const [error, setError] = useState(null);

  const history = useHistory();

  async function tableLoader() {
    const abortController = new AbortController();
    try {
      const res = await deleteTableReservation(
        thisTable.table_id,
        abortController.signal
      );
      const tables = res.find((table) => table.table_id === thisTable.table_id);
      setThisTable({ ...tables });
      listTables();
      return tables;
    } catch (error) {
      setError(error);
    }
  }

  async function clearTableHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    if (
      window.confirm(
        'Is this table ready to seat new guests? This action cannot be undone.'
      )
    ) {
      await changeResStat(
        { status: 'finished' },
        thisTable.reservation_id,
        abortController.signal
      );
      await tableLoader();
      history.push('/tables');
      return;
    }
  }

  return (
    <>
      <div>
        <ErrorAlert error={error} />
        <tr>
          <th scope='row'> {thisTable.table_id} </th>
          <td> {thisTable.table_name} </td>
          <td> {thisTable.capacity} </td>
          <td> {thisTable.reservation_id} </td>
          <td data-table-id-status={`${table.table_id}`}>
            {' '}
            {thisTable.table_status}{' '}
          </td>
          <td>
            {thisTable.reservation_id ? (
              <button
                className='btn btn-danger'
                onClick={clearTableHandler}
                data-table-id-finish={`${table.table_id}`}
              >
                Finish
              </button>
            ) : (
              <></>
            )}
          </td>
        </tr>
      </div>
    </>
  );
}

export default TableList;
