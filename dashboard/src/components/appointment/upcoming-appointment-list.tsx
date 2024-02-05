import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';
import { calculateDetailedAge, formatDetailedAge } from '../../utils/date';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderIcon from '@mui/icons-material/FolderCopy';
import PersonIcon from '@mui/icons-material/Person';
import BedIcon from '@mui/icons-material/Hotel';
import VisibilityIcon from '@mui/icons-material/Visibility';

const UpcomingAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/appointments/upcoming-schedules');
        console.log(res);
        setAppointments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
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
                    <Link
                      href={`/appointments/${appointment.patient.id}/schedule-appointment`}
                      className="btn btn-warning text-white py-0 px-1 me-1"
                      title="Reschedule appointment"
                    >
                      <CalendarIcon />
                    </Link>

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
    </>
  );
};
export default UpcomingAppointmentsList;
