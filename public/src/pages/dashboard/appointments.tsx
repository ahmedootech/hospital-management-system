import { Nav, Navbar } from 'react-bootstrap';
import PageHeader from '../../components/layouts/page-header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApiV1Instance } from '../../utils/axios-instance';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await getApiV1Instance().get('/appointments/patient');
      console.log(res);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAppointments();
  }, []);
  return (
    <>
      <PageHeader title="Appointments" />
      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-lg-2">
            <Navbar>
              <Nav className="d-flex flex-column">
                <Link href="/dashboard/appointments" passHref legacyBehavior>
                  <Nav.Link>Appointments</Nav.Link>
                </Link>
                <Link href="/dashboard/lab-results" passHref legacyBehavior>
                  <Nav.Link>Lab Results</Nav.Link>
                </Link>
              </Nav>
            </Navbar>
          </div>
          <div className="col-lg-10">
            <h2>Appointments</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Scheduled Date</th>
                  <th>Type</th>
                  <th>Meeting Link</th>
                  <th>Duration</th>
                  <th>Date Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>
                      {new Date(appointment.dateTime).toLocaleDateString()}
                    </td>
                    <td>{appointment.type}</td>
                    <td>
                      {appointment.meetingLink ? (
                        <a href={appointment.meetingLink}>Meeting Link</a>
                      ) : (
                        'Not set'
                      )}
                    </td>
                    <td>
                      {appointment.duration
                        ? appointment.duration + 'Mins'
                        : 'Not set'}
                    </td>
                    <td>{new Date(appointment.createdAt).toLocaleString()}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
