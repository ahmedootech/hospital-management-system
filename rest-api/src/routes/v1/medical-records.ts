import { Request, Response, Router } from 'express';
import { Order } from '../../models/v1/order';
import {
  findMyPendingTask,
  findPendingOrderItemsForDepartment,
  updateOrderItemStatus,
} from '../../helpers/order';
import { currentUser } from '../../common/middlewares/current-user';
import { OrderStatus } from '../../common/types/order-types';
import { requireAuth } from '../../common/middlewares/require-auth';
import { MedicalRecord } from '../../models/v1/medical-record';
import { Patient } from '../../models/v1/patient';
import { BadRequestError } from '../../common/errors/bad-request-error';
import { body } from 'express-validator';
import { upload } from '../../common/middlewares/file-upload';

const router = Router();

router.get('/:patientId/records', async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findById(patientId);
  if (!patient) throw new BadRequestError('Patient record not found');

  const medicalRecords = await MedicalRecord.find({
    patient: patientId,
  })
    .populate([
      'vitalSigns.servedBy',
      'clinicalNotes.servedBy',
      'investigations.servedBy',
      'investigations.investigation',
    ])
    .sort({ _id: -1 });

  res.send(medicalRecords);
});
router.put(
  '/:patientId/vital-signs',
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { patientId } = req.params;
    const { assessments } = req.body;

    console.log(assessments);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new BadRequestError('Patient record not found');
    const medicalRecord = await MedicalRecord.findOrCreateTodayClinicalNote(
      patientId
    );
    if (medicalRecord.vitalSigns && medicalRecord.vitalSigns.length < 1)
      medicalRecord.vitalSigns = [
        { signs: assessments, servedBy: req.user.id },
      ];
    else
      medicalRecord.vitalSigns?.push({
        signs: assessments,
        servedBy: req.user.id,
      });

    await medicalRecord.save();

    res.send(medicalRecord);
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Set time to midnight

    // // Define the start and end of today
    // const startOfDay = new Date(today);
    // const endOfDay = new Date(today);
    // endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

    // // Find medical records created today
    // const todayRecord = await MedicalRecord.findOne({

    //   date: {
    //     $gte: startOfDay,
    //     $lte: endOfDay,
    //   },
    // });
    // if(todayRecord){

    // }
  }
);

router.put(
  '/:patientId/clinical-notes',
  [
    body('note').notEmpty().withMessage('Clinical note is required'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  ],
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { patientId } = req.params;
    const { note, diagnosis, prescriptions } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) throw new BadRequestError('Patient record not found');
    const medicalRecord = await MedicalRecord.findOrCreateTodayClinicalNote(
      patientId
    );
    if (medicalRecord.vitalSigns && medicalRecord.vitalSigns.length < 1)
      medicalRecord.clinicalNotes = [
        { note, diagnosis, prescriptions, servedBy: req.user.id },
      ];
    else
      medicalRecord.clinicalNotes?.push({
        note,
        diagnosis,
        prescriptions,
        servedBy: req.user.id,
      });

    await medicalRecord.save();

    res.send(medicalRecord);
  }
);

router.put(
  '/:patientId/investigations',
  upload.single('image'),
  [
    body('investigation').notEmpty().withMessage('Investigation is required'),
    body('result').notEmpty().withMessage('Investigation result is required'),
  ],
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const { patientId } = req.params;
    const { investigation, result, remark } = req.body;
    const uploadedImagePath = req.file?.path.replace(/\\/g, '/');

    const patient = await Patient.findById(patientId);
    if (!patient) throw new BadRequestError('Patient record not found');
    const medicalRecord = await MedicalRecord.findOrCreateTodayClinicalNote(
      patientId
    );
    if (medicalRecord.investigations && medicalRecord.investigations.length < 1)
      medicalRecord.investigations = [
        {
          investigation,
          result,
          remark,
          imageURL: uploadedImagePath,
          servedBy: req.user.id,
        },
      ];
    else
      medicalRecord.investigations?.push({
        investigation,
        result,
        remark,
        imageURL: uploadedImagePath,
        servedBy: req.user.id,
      });

    await medicalRecord.save();

    res.send(medicalRecord);
  }
);

export { router as v1MedicalRecordRoutes };
