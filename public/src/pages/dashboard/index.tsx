import { Nav, Navbar } from 'react-bootstrap';
import PageHeader from '../../components/layouts/page-header';
import Link from 'next/link';

const Dashboard = () => {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-lg-3">
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
          <div className="col-lg-9"></div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
