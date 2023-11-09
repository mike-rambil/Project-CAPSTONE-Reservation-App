import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../../layout/ErrorAlert';
import {
  createReservation,
  getReservation,
  updateReservation,
} from '../../utils/api';

function ReservationForm({ isEditing = false, date }) {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [currentReservation, setCurrentReservation] = useState({
    reservation_id,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReservation(reservation_id);
        setCurrentReservation({
          ...res,
          people: Number(res.people),
        });
      } catch (error) {
        setError(error);
      }
    };

    if (isEditing && reservation_id) {
      fetchData();
    }
  }, [isEditing, reservation_id]);

  const [reservation, setReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: date,
    reservation_time: '',
    people: '',
  });

  const [error, setError] = useState(null);

  // <------------------------- Form Handlers (ln 44-66) ----------------------->

  const handleChange = ({ target }) => {
    const formData = isEditing ? currentReservation : reservation;
    formData[target.name] = target.value;
    isEditing
      ? setCurrentReservation({ ...formData })
      : setReservation({ ...formData });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiFunction = isEditing ? updateReservation : createReservation;
    const formData = isEditing ? currentReservation : reservation;

    apiFunction({
      ...formData,
      people: Number(formData.people),
    })
      .then(() => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch(setError);
  };

  return (
    <>
      <h1>{isEditing ? 'Edit Reservation' : 'Create A Reservation'}</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className='form-group'>
        <div className='row mb-3'>
          <div className='col-4 form-group'>
            <label className='form-label' htmlFor='first_name'>
              First Name
            </label>
            <input
              className='form-control'
              id='first_name'
              name='first_name'
              type='text'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.first_name}
              value={currentReservation.first_name}
            />
          </div>
          <div className='col-4'>
            <label className='form-label' htmlFor='last_name'>
              Last Name
            </label>
            <input
              className='form-control'
              id='last_name'
              name='last_name'
              type='text'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.last_name}
              value={currentReservation.last_name}
            />
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-4 form-group'>
            <label className='form-label' htmlFor='mobile_number'>
              Mobile Number
            </label>
            <input
              className='form-control'
              id='mobile_number'
              name='mobile_number'
              type='text'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.mobile_number}
              value={currentReservation.mobile_number}
            />
          </div>
          <div className='col-4 form-group'>
            <label className='form-label' htmlFor='mobile_number'>
              No of People
            </label>
            <input
              className='form-control'
              id='people'
              name='people'
              type='number'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.people}
              value={currentReservation.people}
            />
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-4 form-group'>
            <label>Reservation Date</label>
            <input
              className='form-control'
              id='reservation_date'
              name='reservation_date'
              type='date'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.reservation_date}
              value={currentReservation.reservation_date}
            />
          </div>
          <div className='col-4 form-group'>
            <label>Reservation Time</label>
            <input
              className='form-control'
              id='reservation_time'
              name='reservation_time'
              type='time'
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.reservation_time}
              value={currentReservation.reservation_time}
            />
          </div>
        </div>
        <button
          type='button'
          className='btn btn-secondary mr-2'
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type='submit' className='btn btn-primary'>
          Submit Edit
        </button>
      </form>
    </>
  );
}

export default ReservationForm;
