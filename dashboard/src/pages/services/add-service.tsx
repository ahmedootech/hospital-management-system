import PageHeader from '../../layout/page-header';
import PatientForm from '../../components/patient/patient-form';
import Link from 'next/link';
import DepartmentForm from '../../components/department/department-form';
import ServiceForm from '../../components/service/service-form';

const AddService = () => {
  return (
    <>
      <PageHeader
        title="Add New Service"
        description="Add new hospital service"
      >
        <Link href="/services" className="btn btn-success px-4">
          Service List
        </Link>
      </PageHeader>
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-9">
            <div className="">
              <ServiceForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddService;
