import Link from 'next/link';
import PageHeader from '../../layout/page-header';
import DepartmentList from '../../components/department/department-list';

const Department = () => {
  return (
    <>
      <PageHeader
        title="Department List"
        description="List and manage departments"
      >
        <Link
          href="/departments/add-department"
          className="btn btn-success px-4"
        >
          Add New Department
        </Link>
      </PageHeader>
      <DepartmentList />
    </>
  );
};
export default Department;
