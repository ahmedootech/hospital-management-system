import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <>
      {departments.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th>Date Created</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">{department.name}</td>
                  <td>
                    {department.description
                      ? department.description
                      : 'No description'}
                  </td>
                  <td>{new Date(department.createdAt).toLocaleString()}</td>
                  <td className="text-nowrap">
                    <Link
                      href={`/departments/${department.id}`}
                      className="btn btn-light py-0 px-1 "
                      title="Explore"
                    >
                      <VisibilityIcon />
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-warning text-white py-0 px-1 mx-1"
                      title="Edit Department"
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
export default DepartmentList;
