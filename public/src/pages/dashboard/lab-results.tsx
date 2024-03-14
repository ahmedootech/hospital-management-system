import { Nav, Navbar } from 'react-bootstrap';
import PageHeader from '../../components/layouts/page-header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApiV1Instance } from '../../utils/axios-instance';
import MedicalRecords from '../../components/medical-record/medical-records';

const LabResults = () => {
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
      <PageHeader title="Lab Records" />
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
            <MedicalRecords />
          </div>
        </div>
      </div>
    </>
  );
};
export default LabResults;
