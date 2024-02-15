// import { useAuth } from '../../../auth/hooks/use-auth';

const navigation = () => {
  // const auth = useAuth();

  if (['Manager', 'Admin'].includes('Admin')) {
    return [
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
      {
        label: 'Appointments',
        children: [
          // {label : 'POS'},
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
          { label: 'Outpatients', path: '/patients/out-patients' },
          { label: 'Patient List', path: '/patients/' },
        ],
      },

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
      {
        label: 'Billing',
        children: [
          { label: 'Invoices', path: '/billings/invoices' },
          { label: 'Payments', path: '/billings/payments' },
          { label: 'Billing Reports', path: '/billings/reports' },
        ],
      },
      {
        label: 'Reports',
        children: [
          { label: 'Today', path: '/reports/today' },
          { label: 'Range Report', path: '/reports/range-report' },
        ],
      },

      // {
      //   label: 'Sales',
      //   path: '/reports',
      //   children: [
      //     { label: 'Sales point', path: '/sales/sales-point' },
      //     { label: 'Today sales', path: '/sales/today' },
      //     { label: 'Sales list', path: '/sales' },
      //   ],
      // },
      // {
      //   label: 'Products',
      //   path: '/products',
      //   children: [
      //     { label: 'Stock in', path: '/products/stock-in' },
      //     { label: 'Products', path: '/products' },
      //     { label: 'Categories', path: '/products/categories' },
      //   ],
      // },
      // {
      //   label: 'Users',
      //   path: '/users',
      //   children: [{ label: 'Users', path: '/users' }],
      // },
      // {
      //   label: 'Suppliers',
      //   path: '/suppliers',
      // },
      // {
      //   label: 'Customers',
      //   path: '/suppliers',
      // },
    ];
  } else if (['Sales'].includes(auth.user.role)) {
    return [
      {
        label: 'Sales',
        path: '/reports',
        children: [
          { label: 'Sales point', path: '/sales/sales-point' },
          { label: 'My sales', path: '/sales/my-sales' },
        ],
      },
    ];
  }

  return [];
};
export default navigation;
