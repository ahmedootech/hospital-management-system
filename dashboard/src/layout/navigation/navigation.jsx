import Cookies from 'js-cookie';
const navigation = () => {
  const role = Cookies.get('role');

  let myNav = [];

  if (['Doctor', 'Nurse', 'Lab Technician', 'Radiologist'].includes(role)) {
    myNav = myNav.concat([
      {
        label: 'Tasks',
        children: [
          {
            label: 'Pending Tasks',
            path: '/tasks/pending-tasks',
          },
          {
            label: 'My Tasks',
            path: '/tasks/my-tasks',
          },
          {
            label: 'Recent Tasks',
            path: '/tasks/recent-tasks',
          },
        ],
      },
    ]);
  }

  if (['Cashier', 'Receptionist', 'Admin'].includes(role)) {
    myNav = myNav.concat([
      {
        label: 'Appointments',
        children: [
          {
            label: 'Today Appointments',
            path: '/appointments/today-appointments',
          },
          {
            label: 'Upcoming Appointments',
            path: '/appointments/upcoming-appointments',
          },
        ],
      },
      {
        label: 'Patients',
        children: [
          { label: 'Add New Patient', path: '/patients/add-patient' },
          { label: 'Inpatients', path: '/patients/in-patients' },
          // { label: 'Outpatients', path: '/patients/out-patients' },
          { label: 'Patient List', path: '/patients/' },
        ],
      },
    ]);
  }

  if (['Manager', 'Admin'].includes(role)) {
    myNav = myNav.concat([
      {
        label: 'Staff',
        children: [
          { label: 'Staff List', path: '/staffs/' },
          { label: 'Add New Staff', path: '/staffs/add-staff' },
        ],
      },
      {
        label: 'Services',
        children: [
          { label: 'Service List', path: '/services/' },
          { label: 'Add New Service', path: '/services/add-service' },
        ],
      },
      {
        label: 'Departments',
        children: [
          { label: 'Department List', path: '/departments/' },
          { label: 'Add New Department', path: '/departments/add-department' },
        ],
      },
      {
        label: 'Rooms',
        children: [
          { label: 'Room List', path: '/rooms/' },
          { label: 'Add New Room', path: '/rooms/add-room' },
        ],
      },
    ]);
  }

  return myNav;
};

export default navigation;
