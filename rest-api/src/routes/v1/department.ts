import { Request, Response, Router } from 'express';
import { FieldValidationError, body } from 'express-validator';
import { validateRequest } from '../../common/middlewares/validate-request';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import { authorization } from '../../common/middlewares/authorization';
import { Department } from '../../models/v1/department';
import { RequestValidationError } from '../../common/errors/request-validation-error';

const router = Router();

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Department name is required')],
  [
    validateRequest,
    currentUser,
    requireAuth,
    authorization(['Manager', 'Admin']),
  ],
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment)
      throw new RequestValidationError([
        {
          msg: 'Department name already exist',
          path: 'name',
        } as FieldValidationError,
      ]);

    const department = Department.build({ name, description });
    await department.save();

    res.json(department);
  }
);

router.get(
  '/',
  [currentUser, requireAuth, authorization(['Admin', 'Manager'])],
  async (req: Request, res: Response) => {
    const departments = await Department.find({}).limit(20);
    res.json(departments);
  }
);

export { router as v1DepartmentRoutes };
