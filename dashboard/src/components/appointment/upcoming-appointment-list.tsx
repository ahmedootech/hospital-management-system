import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';
import PersonIcon from '@mui/icons-material/Person';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import AppointmentForm from './appointment-form';
import { AppointmentHeader, AppointmentItem } from './partials';
import { useRouter } from 'next/router';

const UpcomingAppointmentsList = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const showRescheduleFormHandler = (appointment) => {
    setSelectedAppointment(appointment);
    setShow(true);
  };

  const getData = async () => {
    try {
      const res = await apiV1.get('/appointments/upcoming-schedules');
      console.log(res);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const updateAppointmentStatus = async (
    appointmentId,
    status: 'Cancelled' | 'Completed'
  ) => {
    try {
      return await apiV1.put(`/appointments/${appointmentId}`, { status });
    } catch (err) {
      throw err;
    }
  };
  const cancelAppointmentHandler = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'Cancelled');
      toast.success('Appointment cancelled');
      getData();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };
  const attendAppointmentHandler = async (appointment) => {
    try {
      await updateAppointmentStatus(appointment.id, 'Completed');
      toast.success('Appointment completed');
      router.replace(`/pos/${appointment.patient.id}/serve`);
      // getData();
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
            <AppointmentHeader />
            <tbody>
              {appointments.map((appointment, index) => (
                <AppointmentItem
                  key={index}
                  appointment={appointment}
                  cancelAppointmentHandler={cancelAppointmentHandler}
                  showRescheduleFormHandler={() =>
                    showRescheduleFormHandler(appointment)
                  }
                  attendAppointmentHandler={() =>
                    attendAppointmentHandler(appointment)
                  }
                />
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
          <AppointmentForm
            patientId={selectedAppointment?.patient.id}
            appointment={selectedAppointment}
            updateMode
            updateListHandler={getData}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default UpcomingAppointmentsList;
