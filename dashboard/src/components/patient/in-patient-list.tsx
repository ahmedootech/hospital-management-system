import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';
import { calculateDetailedAge, formatDetailedAge } from '../../utils/date';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderIcon from '@mui/icons-material/FolderCopy';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import PersonIcon from '@mui/icons-material/Person';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import BedIcon from '@mui/icons-material/Hotel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { isAuthorized } from '../../utils';

const InPatientList = () => {
  const [admissions, setAdmissions] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/admissions/admitted');
        console.log(res);
        setAdmissions(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <>
      {admissions.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Doctor</th>
                <th>Room</th>
                <th>Admitted Since</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((admission, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">
                    <p className="py-0 my-0">{`${admission.patient.firstName} ${admission.patient.lastName}`}</p>
                  </td>

                  <td>
                    {formatDetailedAge(
                      calculateDetailedAge(admission.patient.dob)
                    )}
                  </td>
                  <td>{admission.patient.gender}</td>
                  <td>{`${admission.doctor.firstName} ${admission.doctor.lastName}`}</td>
                  <td>{admission.room.name}</td>
                  {/* <td>{admission.patient.username}</td> */}
                  <td className="text-nowrap">
                    {/* {new Date(admission.createdAt).toLocaleString()} */}
                    {formatDetailedAge(
                      calculateDetailedAge(admission.createdAt)
                    )}
                  </td>
                  <td className="text-nowrap">{admission.status}</td>

                  <td className="text-nowrap">
                    <Link
                      href={`/admissions/${admission.patient.id}/history`}
                      className="btn bg-success py-0 px-1  bg-opacity-75 text-white"
                      title="Explore admission"
                    >
                      <VisibilityIcon />
                    </Link>

                    {isAuthorized(['Admin', 'Nurse', 'Doctor']) && (
                      <Link
                        href={{
                          pathname: `/patients/${admission.patient.id}/medical-record`,
                          query: {
                            patientName: `${admission.patient.firstName} ${admission.patient.lastName}`,
                          },
                        }}
                        className="btn btn-info py-0 px-1 mx-1 text-white"
                        title="Medical Records"
                      >
                        <FolderIcon />
                      </Link>
                    )}

                    {/* <Link
                      href={`/patients/${admission.patient.id}/profile`}
                      className="btn btn-success py-0 px-1"
                      title="Patient Profile"
                    >
                      <PersonIcon />
                    </Link> */}
                    {/* {isAuthorized([
                      'Admin',
                      'Manager',
                      'Receptionist',
                      'Cashier',
                    ]) && (
                      <button
                        className="btn btn-danger py-0 px-1 mx-1 text-white"
                        title="Discharge"
                      >
                        <RemoveDoneIcon />
                      </button>
                    )} */}
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
export default InPatientList;
