import PageHeader from '../../layout/page-header';
import Link from 'next/link';
import PatientList from '../../components/patient/patient-list';

const Patients = () => {
  return (
    <>
      <PageHeader title="Patient List" description="List of patient and option">
        <Link href="/patients/add-patient" className="btn btn-success px-4">
          Add New Patient
        </Link>
      </PageHeader>
      <PatientList />
    </>
  );
};

export default Patients;
