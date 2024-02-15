import PersonIcon from '@mui/icons-material/Person';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Link from 'next/link';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Button, Tooltip } from 'react-bootstrap';

export const AppointmentHeader = () => {
  return (
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
  );
};

export const AppointmentItem = ({
  appointment,
  cancelAppointmentHandler,
  showRescheduleFormHandler,
  attendAppointmentHandler,
}) => {
  const renderTooltip = (props, title) => (
    <Tooltip id="button-tooltip" {...props}>
      {title}
    </Tooltip>
  );
  return (
    <tr key={appointment.id} className="align-middle">
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
      <td
        className={`${
          appointment.status === 'Cancelled' ? 'text-danger' : ''
        } `}
      >
        {appointment.status === 'Rescheduled' ? (
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) =>
              renderTooltip(
                props,
                new Date(
                  appointment.rescheduledAppointment.dateTime
                ).toLocaleString()
              )
            }
          >
            <span>{appointment.status}</span>
          </OverlayTrigger>
        ) : (
          appointment.status
        )}
      </td>

      <td className="text-nowrap">
        <button
          // href={`/pos/${appointment.patient.id}/serve`}
          className="btn bg-success py-0 px-1 me-1 bg-opacity-75 text-white"
          title="Provide Service"
          disabled={['Cancelled', 'Rescheduled', 'Completed'].includes(
            appointment.status
          )}
          onClick={attendAppointmentHandler}
        >
          <MedicalServicesIcon />
        </button>
        <button
          className="btn btn-secondary text-white py-0 px-1 me-1"
          title="Reschedule appointment"
          disabled={['Rescheduled', 'Completed'].includes(appointment.status)}
          onClick={showRescheduleFormHandler}
        >
          <EventRepeatIcon />
        </button>
        <button
          className="btn btn-danger text-white py-0 px-1 me-1"
          title="Cancel appointment"
          disabled={['Cancelled', 'Rescheduled', 'Completed'].includes(
            appointment.status
          )}
          onClick={() => cancelAppointmentHandler(appointment.id)}
        >
          <EventBusyIcon />
        </button>
        <Link
          href={`/patients/${appointment.patient.id}/profile`}
          className="btn btn-success py-0 px-1"
          title="Patient Profile"
        >
          <PersonIcon />
        </Link>
      </td>
    </tr>
  );
};
