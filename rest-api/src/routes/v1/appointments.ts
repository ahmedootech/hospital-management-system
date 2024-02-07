import { Request, Response, Router } from 'express';
import {
  FieldValidationError,
  body,
  validationResult,
} from 'express-validator';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { AppointmentStatus } from '../../common/types/order-types';
import { Admission } from '../../models/v1/admission';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { authorization } from '../../common/middlewares/authorization';
import { requireAuth } from '../../common/middlewares/require-auth';
import { currentUser } from '../../common/middlewares/current-user';
import { Appointment } from '../../models/v1/appointment';
import { validateRequest } from '../../common/middlewares/validate-request';
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
        // $gte: tomorrowStart,
        // $lte: todayEnd,
      },
    }).populate(['patient', 'doctor']);
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
    }).populate(['patient', 'doctor']);
    res.json(appointments);
  }
);

router.get('/statuses', (req: Request, res: Response) => {
  const statuses = Object.values(AppointmentStatus);
  res.json(statuses);
});

router.put('/:appointmentId', async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  console.log(appointmentId);
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: req.body.status },
    { new: true }
  );
  res.send(appointment);
});

export { router as v1AppointmentRoutes };
