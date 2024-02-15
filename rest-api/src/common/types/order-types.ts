export enum OrderStatus {
  Pending = 'Pending',
  'In Progress' = 'In Progress',
  Complete = 'Complete',
}

export enum OrderType {
  Physical = 'Physical',
  Online = 'Online',
}

export enum PaymentMethods {
  Cash = 'Cash',
  POS = 'POS',
  Transfer = 'Transfer',
  Online = 'Online',
  Admission = 'Admission',
}

export enum AdmissionStatus {
  Admitted = 'Admitted',
  Discharged = 'Discharged',
  Transferred = 'Transferred',
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Rescheduled = 'Rescheduled',
}
