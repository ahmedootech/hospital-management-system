import { NextPageContext } from 'next';
import PageHeader from '../../../layout/page-header';
import { apiV1 } from '../../../utils/axios-instance';
import AdmissionForm from '../../../components/admission/admission-form';
import AppointmentForm from '../../../components/appointment/appointment-form';

const ScheduleAppointment = ({ patient }) => {
  return (
    <>
      <PageHeader
        title="Schedule Appointment"
        description={`Patient name (${patient.firstName} ${patient.lastName})`}
      />
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-10">
            <AppointmentForm patientId={patient.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const cookies = context.req?.cookies;

  const { query } = context;
  const patientId = query.patientId;

  if (!patientId) {
    return {
      redirect: {
        destination: '/patients',
        permanent: false,
      },
    };
  }
  try {
    const patientRes = await apiV1.get(`/patients/${patientId}`, {
      headers: { Authorization: cookies.token },
    });

    return {
      props: {
        patient: patientRes.data,
      },
    };
  } catch (err) {
    console.log(err.response.data);
    return {
      redirect: {
        destination: '/patients',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
export default ScheduleAppointment;
