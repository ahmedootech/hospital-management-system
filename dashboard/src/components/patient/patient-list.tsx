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
import BedIcon from '@mui/icons-material/Hotel';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/patients');
        setPatients(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <>
      {patients.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Marital</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">
                    <p className="py-0 my-0">{`${patient.firstName} ${patient.lastName}`}</p>
                  </td>

                  <td>
                    {formatDetailedAge(calculateDetailedAge(patient.dob))}
                  </td>
                  <td>{patient.gender}</td>
                  <td>{patient.marital}</td>
                  <td>{patient.phone}</td>
                  <td className="text-nowrap">{patient.address}</td>
                  <td>{patient.status}</td>
                  <td className="text-nowrap">
                    <Link
                      href={`/pos/${patient.id}/serve`}
                      className="btn bg-success py-0 px-1  bg-opacity-75 text-white"
                      title="Provide Service"
                    >
                      <MedicalServicesIcon />
                    </Link>
                    <Link
                      href={`/admissions/${patient.id}/admit`}
                      className="btn bg-danger py-0 px-1  bg-opacity-75 text-white mx-1"
                      title="Admit Patient"
                    >
                      <BedIcon />
                    </Link>

                    <Link
                      href={`/appointments/${patient.id}/schedule-appointment`}
                      className="btn btn-warning text-white py-0 px-1 me-1"
                      title="Make appointment"
                    >
                      <CalendarIcon />
                    </Link>
                    <Link
                      href={`/patients/${patient.id}/medical-history`}
                      className="btn btn-info py-0 px-1 text-white"
                      title="Medical Records"
                    >
                      <FolderIcon />
                    </Link>
                    <Link
                      href={`/patients/${patient.id}/profile`}
                      className="btn btn-success py-0 px-1 ms-1"
                      title="Patient Profile"
                    >
                      <PersonIcon />
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
export default PatientList;
