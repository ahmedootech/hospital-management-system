import PageHeader from '../../layout/page-header';
import Link from 'next/link';
import DepartmentForm from '../../components/department/department-form';

const AddDepartment = () => {
  return (
    <>
      <PageHeader
        title="Add New Department"
        description="Add new hospital department"
      >
        <Link href="/departments" className="btn btn-success px-4">
          Department List
        </Link>
      </PageHeader>
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-9">
            <div className="">
              <DepartmentForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddDepartment;
