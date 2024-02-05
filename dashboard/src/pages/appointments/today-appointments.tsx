import PageHeader from '../../layout/page-header';
import TodayAppointmentsList from '../../components/appointment/today-appointment-list';

const TodayAppointments = () => {
  return (
    <>
      <PageHeader
        title="Today Appointments"
        description="List of today appointments and option"
      />
      <TodayAppointmentsList />
    </>
  );
};

export default TodayAppointments;
