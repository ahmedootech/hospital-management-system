import Link from 'next/link';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderIcon from '@mui/icons-material/FolderCopy';
import PersonIcon from '@mui/icons-material/Person';
import BedIcon from '@mui/icons-material/Hotel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';

export const TaskHeader = () => {
  return (
    <thead>
      <tr>
        <th>Task Name</th>
        <th>Patient</th>
        <th>Created By</th>
        <th>Date</th>
        <th>Status</th>
        <th>Options</th>
      </tr>
    </thead>
  );
};
export const TaskItem = ({
  task,
  pickTaskHandler = () => {},
  completeTaskHandler = () => {},
}) => {
  return (
    <tr>
      <td>{task.service?.name}</td>
      <td>{`${task.patient.firstName} ${task.patient.lastName}`}</td>
      <td>{`${task.staff.firstName} ${task.staff.lastName}`}</td>
      <td>{new Date(task.date).toLocaleString()}</td>
      <td>{task.status}</td>
      <td>
        {task.status === 'Pending' ? (
          <button
            className="btn btn-warning py-0 px-1 text-white"
            title="Pick Task"
            onClick={pickTaskHandler}
          >
            <CheckIcon />
          </button>
        ) : (
          <>
            <Link
              href={`/patients/${task.patient.id}/medical-record`}
              className="btn btn-info py-0 px-1 text-white me-1"
              title="Medical Records"
            >
              <NoteAddIcon />
            </Link>
            <button
              className="btn btn-success py-0 px-1 text-white"
              title="Complete Task"
              onClick={completeTaskHandler}
            >
              <CheckIcon />
            </button>
          </>
        )}
      </td>
    </tr>
  );
};
