import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';
import { calculateDetailedAge, formatDetailedAge } from '../../utils/date';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderIcon from '@mui/icons-material/FolderCopy';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/services');
        setServices(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <>
      {services.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price</th>
                <th>Department</th>
                <th>Date Created</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">{service.name}</td>
                  <td className="text-nowrap">{service.price}</td>
                  <td className="text-nowrap">{service.department.name}</td>
                  <td>
                    {service.description
                      ? service.description
                      : 'No description'}
                  </td>
                  <td>{new Date(service.createdAt).toLocaleString()}</td>
                  <td className="text-nowrap">
                    <Link
                      href={`/services/${service.id}`}
                      className="btn btn-light py-0 px-1 "
                      title="Explore"
                    >
                      <VisibilityIcon />
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-warning text-white py-0 px-1 mx-1"
                      title="Edit Service"
                    >
                      <EditIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Record Found</p>
      )}
    </>
  );
};
export default ServiceList;
