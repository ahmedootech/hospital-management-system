import { Request, Response, Router } from 'express';
import { Patient } from '../../models/v1/patient';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import { authorization } from '../../common/middlewares/authorization';

const router = Router();

router.get(
  '/',
  [
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager', 'Cashier', 'Receptionist']),
  ],
  async (req: Request, res: Response) => {
    const patients = await Patient.find({}).limit(20).sort({ _id: -1 });
    res.json(patients);
  }
);

router.get(
  '/:patientId',
  [currentUser, requireAuth, authorization(['Admin', 'Manager', 'Cashier'])],
  async (req: Request, res: Response) => {
    const patient = await Patient.findById(req.params.patientId);
    res.json(patient);
  }
);

export { router as v1PatientRoutes };
