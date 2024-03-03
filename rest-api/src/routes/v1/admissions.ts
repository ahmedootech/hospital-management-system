import { Request, Response, Router } from 'express';
import { FieldValidationError, body } from 'express-validator';
import {
  AdmissionStatus,
  PaymentMethods,
} from '../../common/types/order-types';
import { Admission } from '../../models/v1/admission';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { authorization } from '../../common/middlewares/authorization';
import { requireAuth } from '../../common/middlewares/require-auth';
import { currentUser } from '../../common/middlewares/current-user';
import { validateRequest } from '../../common/middlewares/validate-request';
import { Order } from '../../models/v1/order';

const router = Router();

router.post(
  '/admit',
  [
    body('patient').notEmpty().withMessage('Patient is required'),
    body('initialDeposit')
      .trim()
      .isNumeric()
      .withMessage('Only numbers is allowed')
      .notEmpty()
      .withMessage('Department name is required'),
    body('room').notEmpty().withMessage('Admission room is required'),
    body('doctor').notEmpty().withMessage('Doctor is required'),
  ],
  [validateRequest],
  async (req: Request, res: Response) => {
    const { initialDeposit, room, patient, doctor } = req.body;

    const existingAdmission = await Admission.findOne({
      patient,
      status: { $ne: AdmissionStatus.Discharged },
    });
    if (existingAdmission)
      throw new RequestValidationError([
        {
          msg: 'Patient already admitted',
          path: 'patientId',
        } as FieldValidationError,
      ]);

    const admission = Admission.build({
      patient,
      initialDeposit,
      room,
      doctor,
    });

    await admission.save();

    res.json(admission);
  }
);

router.get(
  '/admitted',
  [
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager', 'Cashier', 'Receptionist']),
  ],
  async (req: Request, res: Response) => {
    const patients = await Admission.find({ status: 'Admitted' }).populate([
      'patient',
      'doctor',
      'room',
    ]);
    res.json(patients);
  }
);
router.get('/statuses', (req: Request, res: Response) => {
  const statuses = Object.values(AdmissionStatus);
  res.json(statuses);
});
router.post('/:patientId/discharge', async (req: Request, res: Response) => {
  const { patientId } = req.params;

  const { amountReceived, paymentMode } = req.body;
  const admission = await Admission.findOneAndUpdate(
    { patient: patientId },
    { status: AdmissionStatus.Discharged }
  );

  await Order.updateMany(
    { patient: patientId, paymentMode: PaymentMethods.Admission },
    { $set: { paymentMode } }
  );
  // const ordersOnAdmission = await Order.find({
  //   patient: patientId,
  //   paymentMode: PaymentMethods.Admission,
  // })
  res.send(admission);
});

router.get('/:patientId', async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const admission = await Admission.findOne({ patient: patientId }).populate([
    'room',
  ]);
  res.send(admission);
});

export { router as v1AdmissionRoutes };
