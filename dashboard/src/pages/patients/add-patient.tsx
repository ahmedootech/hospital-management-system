import PageHeader from '../../layout/page-header';
import PatientForm from '../../components/patient/patient-form';
import Link from 'next/link';

const AddPatient = () => {
  return (
    <>
      <PageHeader title="Add New Patient">
        <Link href="/patients" className="btn btn-success px-4">
          Patient List
        </Link>
      </PageHeader>
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-9">
            <div className="">
              <PatientForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddPatient;
