import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../../../common/middlewares/validate-request';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../../../common/errors/bad-request-error';
import { requireAuth } from '../../../common/middlewares/require-auth';
import { authorization } from '../../../common/middlewares/authorization';
import { currentUser } from '../../../common/middlewares/current-user';
import { PasswordManager } from '../../../services/password-manager';
import { NotFoundError } from '../../../common/errors/not-found-error';
import { Staff } from '../../../models/v1/staff';
import { Patient } from '../../../models/v1/patient';
import { RequestValidationError } from '../../../common/errors/request-validation-error';
import { FieldValidationError, ValidationError } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName').trim().notEmpty().withMessage('Last name cannot be empty'),
    body('gender').notEmpty().withMessage('Gender not selected'),
    body('phone').notEmpty().withMessage('Phone number required'),
    body('dob').notEmpty().withMessage('Date of birth is required'),
    body('marital').notEmpty().withMessage('Marital status is required'),
    body('address').notEmpty().withMessage('Patient address is required'),
    body('username').trim().notEmpty().withMessage('Username cannot be empty'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 8 })
      .withMessage('Password must be between 4 to 8 characters'),
  ],
  [
    validateRequest,
    currentUser,
    requireAuth,
    authorization(['Manager', 'Admin']),
  ],
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      gender,
      phone,
      marital,
      dob,
      address,
      username,
      password,
    } = req.body;
    const existingPatient = await Patient.findOne({ username });
    if (existingPatient)
      throw new RequestValidationError([
        {
          msg: 'Username already exist',
          path: 'username',
        } as FieldValidationError,
      ]);
    const patient = Patient.build({
      firstName,
      lastName,
      gender,
      phone,
      dob,
      marital,
      address,
      username,
      password,
    });
    await patient.save();

    res.status(201).send(patient);
  }
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('You must supply a username'),
    body('password').notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingPatient = await Patient.findOne({
      username,
      status: 'Active',
    });

    if (!existingPatient) throw new BadRequestError('Invalid credentials');

    const passwordsMatch = await PasswordManager.compare(
      existingPatient.password,
      password
    );

    if (!passwordsMatch) throw new BadRequestError('Invalid credentials');

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingPatient.id,
        name: `${existingPatient.firstName} ${existingPatient.lastName}`,
        username: existingPatient.username,
      },
      process.env.JWT_KEY!
    );

    res.status(200).send({ jwt: userJwt });
  }
);

export { router as patientAuthRouter };
