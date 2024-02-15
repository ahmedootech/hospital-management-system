import { Request, Response, Router } from 'express';
import { FieldValidationError, body } from 'express-validator';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { AppointmentStatus } from '../../common/types/order-types';
import { Admission } from '../../models/v1/admission';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { authorization } from '../../common/middlewares/authorization';
import { requireAuth } from '../../common/middlewares/require-auth';
import { currentUser } from '../../common/middlewares/current-user';
import { Appointment } from '../../models/v1/appointment';
import { validateRequest } from '../../common/middlewares/validate-request';
import { isURL } from 'validator';
import mongoose from 'mongoose';

const router = Router();

router.post(
  '/schedule-appointment',
  [currentUser, requireAuth, authorization(['Admin', 'Manager', 'Cashier'])],
  [
    body('patient').notEmpty().withMessage('Patient is required'),
    body('doctor').notEmpty().withMessage('Doctor is required'),
    body('type').notEmpty().withMessage('Meeting type is required'),
    body('dateTime').trim().isISO8601().withMessage('Only date is allowed'),
  ],
  [validateRequest],
  async (req: Request, res: Response) => {
    const { patient, doctor, dateTime, type } = req.body;

    const appointment = Appointment.build({
      patient,
      doctor,
      type,
      dateTime,
      createdBy: req.user.id,
    });

    await appointment.save();

    res.json(appointment);
  }
);

router.put(
  '/schedule-appointment',
  [currentUser, requireAuth, authorization(['Admin', 'Manager', 'Cashier'])],
  [
    body('patient').notEmpty().withMessage('Patient is required'),
    body('appointmentId').notEmpty().withMessage('Patient is required'),
    body('doctor').notEmpty().withMessage('Doctor is required'),
    body('type').notEmpty().withMessage('Meeting type is required'),
    body('dateTime').trim().isISO8601().withMessage('Only date is allowed'),
    body('duration').isNumeric().withMessage('Only numbers are allowed'),
    body('meetingLink')
      .custom((value, { req }) => {
        // Check if the meetingLink field has a value
        if (value) {
          // If the field has a value, validate it as a URL
          if (!isURL(value)) {
            // If it's not a valid URL, throw an error
            throw new Error('Invalid meeting link');
          }
        }
        // If the field is empty or doesn't have a value, return true (validation passes)
        return true;
      })
      .optional() // Mark the field as optional
      .withMessage('Invalid meeting link'),
  ],
  [validateRequest],
  async (req: Request, res: Response) => {
    const {
      patient,
      doctor,
      dateTime,
      type,
      duration,
      meetingLink,
      appointmentId,
    } = req.body;

    const appointment = Appointment.build({
      patient,
      doctor,
      type,
      dateTime,
      duration,
      meetingLink,
      createdBy: req.user.id,
    });

    await appointment.save();

    const previousAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: AppointmentStatus.Rescheduled,
        rescheduledAppointment: appointment.id,
      },
      { new: true }
    ).populate(['patient', 'doctor', 'rescheduledAppointment']);

    res.json(previousAppointment);
  }
);

router.get(
  '/upcoming-schedules',
  [currentUser, requireAuth, authorization(['Admin', 'Manager', 'Cashier'])],
  async (req: Request, res: Response) => {
    const todayEnd = endOfDay(new Date());
    const tomorrowStart = startOfDay(addDays(new Date(), 1));
    const appointments = await Appointment.find({
      //   status: 'Scheduled',
      dateTime: {
        $gte: todayEnd,
      },
    }).populate(['patient', 'doctor', 'rescheduledAppointment']);
    res.json(appointments);
  }
);

router.get(
  '/today',
  [currentUser, requireAuth, authorization(['Admin', 'Manager', 'Cashier'])],
  async (req: Request, res: Response) => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const appointments = await Appointment.find({
      status: 'Scheduled',
      dateTime: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).populate(['patient', 'doctor', 'rescheduledAppointment']);
    res.json(appointments);
  }
);

router.get('/statuses', (req: Request, res: Response) => {
  const statuses = Object.values(AppointmentStatus);
  res.json(statuses);
});

router.put('/:appointmentId', async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: req.body.status },
    { new: true }
  );
  res.send(appointment);
});

export { router as v1AppointmentRoutes };
