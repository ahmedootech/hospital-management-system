import { Request, Response, Router } from 'express';
import { FieldValidationError, body } from 'express-validator';
import { validateRequest } from '../../common/middlewares/validate-request';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import { authorization } from '../../common/middlewares/authorization';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { Room } from '../../models/v1/room';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Room name is required'),
    body('description').trim(),
  ],

  [
    validateRequest,
    currentUser,
    requireAuth,
    authorization(['Manager', 'Admin']),
  ],
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom)
      throw new RequestValidationError([
        {
          msg: 'Room name already exist',
          path: 'name',
        } as FieldValidationError,
      ]);

    const room = Room.build({ name, description });
    await room.save();

    res.json(room);
  }
);

router.get(
  '/available',
  [currentUser, requireAuth, authorization(['Admin', 'Manager'])],
  async (req: Request, res: Response) => {
    const rooms = await Room.find({ status: 'Available' }).limit(20);
    res.json(rooms);
  }
);
router.get(
  '/',
  [currentUser, requireAuth, authorization(['Admin', 'Manager'])],
  async (req: Request, res: Response) => {
    const rooms = await Room.find({}).limit(20);
    res.json(rooms);
  }
);

export { router as v1RoomRoutes };
