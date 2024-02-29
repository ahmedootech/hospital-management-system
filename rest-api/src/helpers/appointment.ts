import moment from 'moment';
import { Appointment } from '../models/v1/appointment';

export const getTodayAppointments = async () => {
  const todayStart = moment().startOf('day').toDate();
  const todayEnd = moment().endOf('day').toDate();
  const appointments = await Appointment.find({
    status: 'Scheduled',
    dateTime: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  }).populate(['patient', 'doctor', 'rescheduledAppointment']);

  return appointments;
};
