import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiV1 } from '../../utils/axios-instance';
import PersonIcon from '@mui/icons-material/Person';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import Modal from 'react-bootstrap/Modal';
import AppointmentForm from './appointment-form';
import { toast } from 'react-toastify';

const TodayAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/appointments/today');
        console.log(res);
        setAppointments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const cancelAppointmentHandler = async (appointmentId) => {
    try {
      const res = await apiV1.put(`/appointments/${appointmentId}`, {
        status: 'Cancelled',
      });
      toast.success('Appointment cancelled');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };
  return (
    <>
      {appointments.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Doctor</th>
                <th>Scheduled Date</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">
                    <p className="py-0 my-0">{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</p>
                  </td>

                  <td>{appointment.patient.gender}</td>
                  <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>

                  <td className="text-nowrap">
                    {new Date(appointment.dateTime).toLocaleString()}
                  </td>
                  <td className="text-nowrap">
                    {new Date(appointment.createdAt).toLocaleString()}
                  </td>
                  <td>{appointment.status}</td>

                  <td className="text-nowrap">
                    <button
                      className="btn btn-secondary text-white py-0 px-1 me-1"
                      title="Reschedule appointment"
                      onClick={() => {
                        setSelectedPatient(appointment.patient);
                        handleShow();
                      }}
                    >
                      <EventRepeatIcon />
                    </button>
                    <button
                      className="btn btn-danger text-white py-0 px-1 me-1"
                      title="Cancel appointment"
                      disabled={appointment.status === 'Cancelled'}
                      onClick={() => cancelAppointmentHandler(appointment.id)}
                    >
                      <EventBusyIcon />
                    </button>
                    <Link
                      href={`/patients/${appointment.patient.id}`}
                      className="btn btn-success py-0 px-1"
                      title="Patient Profile"
                    >
                      <PersonIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Record Found</p>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 pb-5">
          <AppointmentForm patientId={selectedPatient?.id} updateMode />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default TodayAppointmentsList;
