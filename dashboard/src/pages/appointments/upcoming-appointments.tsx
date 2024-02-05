import PageHeader from '../../layout/page-header';
import Link from 'next/link';
import PatientList from '../../components/patient/patient-list';
import InPatientList from '../../components/patient/in-patient-list';
import UpcomingAppointmentsList from '../../components/appointment/upcoming-appointment-list';

const UpcomingAppointments = () => {
  return (
    <>
      <PageHeader
        title="Upcoming Appointments"
        description="List of appointments and option"
      />
      <UpcomingAppointmentsList />
    </>
  );
};

export default UpcomingAppointments;
