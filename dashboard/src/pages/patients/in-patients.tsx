import PageHeader from '../../layout/page-header';
import Link from 'next/link';
import PatientList from '../../components/patient/patient-list';
import InPatientList from '../../components/patient/in-patient-list';

const InPatients = () => {
  return (
    <>
      <PageHeader
        title="Inpatient List"
        description="List of admitted patients and option"
      />
      <InPatientList />
    </>
  );
};

export default InPatients;
