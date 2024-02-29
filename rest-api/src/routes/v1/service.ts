import { Request, Response, Router } from 'express';
import { FieldValidationError, body } from 'express-validator';
import { validateRequest } from '../../common/middlewares/validate-request';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import { authorization } from '../../common/middlewares/authorization';
import { Service } from '../../models/v1/service';
import { Department } from '../../models/v1/department';
import { RequestValidationError } from '../../common/errors/request-validation-error';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('price')
      .trim()
      .notEmpty()
      .withMessage('Service price is required')
      .isNumeric()
      .withMessage('Only number is allowed'),
    body('department')
      .trim()
      .notEmpty()
      .withMessage('No department selected')
      .isMongoId()
      .withMessage('Invalid department type'),
  ],
  [
    validateRequest,
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager']),
  ],
  async (req: Request, res: Response) => {
    const { name, price, department, description } = req.body;

    const existingService = await Service.findOne({ name });
    if (existingService)
      throw new RequestValidationError([
        {
          msg: 'service name already exist',
          path: 'name',
        } as FieldValidationError,
      ]);

    const service = Service.build({ name, price, department, description });
    await service.save();

    res.json(service);
  }
);

router.get(
  '/investigations',
  [
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager', 'Lab Technician']),
  ],
  async (req: Request, res: Response) => {
    
    const investigationDepartments = await Department.find({
      name: { $in: ['Laboratory', 'Radiography'] },
    });

    const departmentIds = investigationDepartments.map(
      (department) => department._id
    );

    const services = await Service.find({
      department: { $in: departmentIds },
    })
      .populate(['department'])
      .limit(20);
    res.json(services);
  }
);

router.get(
  '/',
  [
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager', 'Lab Technician']),
  ],
  async (req: Request, res: Response) => {
    const services = await Service.find({}).populate(['department']).limit(20);
    res.json(services);
  }
);

export { router as v1ServiceRoutes };
