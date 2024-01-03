import Link from 'next/link';
import PageHeader from '../../layout/page-header';
import DepartmentList from '../../components/department/department-list';
import ServiceList from '../../components/service/service-list';

const Services = () => {
  return (
    <>
      <PageHeader
        title="Service List"
        description="List and manage hospital services"
      >
        <Link href="/services/add-service" className="btn btn-success px-4">
          Add New Service
        </Link>
      </PageHeader>
      <ServiceList />
    </>
  );
};
export default Services;
