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

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/staffs');
        setStaffs(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <>
      {staffs.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Department</th>
                <th>Marital</th>
                <th>Username</th>
                <th>Address</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">
                    <p className="py-0 my-0">{`${staff.firstName} ${staff.lastName}`}</p>
                    <p className="form-text py-0 my-0 text-white">
                      <span
                        className={`bg-${
                          staff.gender === 'Male' ? 'primary' : 'danger'
                        } rounded-pill ps-1 pe-2`}
                      >
                        {staff.gender === 'Male' ? (
                          <MaleIcon />
                        ) : (
                          <FemaleIcon />
                        )}
                        {String(staff.gender).split('')[0]}
                      </span>{' '}
                      <span className="bg-secondary bg-opacity-75  rounded-pill px-2">
                        {formatDetailedAge(calculateDetailedAge(staff.dob))}
                      </span>
                    </p>
                  </td>
                  <td>{staff.phone}</td>
                  <td>{staff.role}</td>
                  <td>{staff.department.name}</td>
                  <td>{staff.marital}</td>
                  <td>{staff.username}</td>
                  <td className="text-nowrap">{staff.address}</td>
                  <td>{staff.status}</td>
                  <td className="text-nowrap">
                    <Link
                      href="/"
                      className="btn bg-success py-0 px-1  bg-opacity-75 text-white"
                      title="Provide Service"
                    >
                      <VisibilityIcon />
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-warning text-white py-0 px-1 mx-1"
                      title="Make appointment"
                    >
                      <EditIcon />
                    </Link>
                    {/* <Link
                      href="/"
                      className="btn btn-info py-0 px-1 text-white"
                      title="Medical Records"
                    >
                      <FolderIcon />
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-success py-0 px-1 ms-1"
                      title="Staff Profile"
                    >
                      <PersonIcon />
                    </Link> */}
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
export default StaffList;
