import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../../common/middlewares/require-auth';
import { currentUser } from '../../../common/middlewares/current-user';
import { staffAuthRouter } from './staff';
import { patientAuthRouter } from './patient';

const router = Router();

router.use('/staff', staffAuthRouter);
router.use('/patients', patientAuthRouter);
router.get(
  '/me',
  [currentUser, requireAuth],
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({ ...(req.user || null) });
  }
);
// router.get(
//   '/',
//   [currentUser, requireAuth, authorization(['Manager', 'Admin'])],
//   async (req: Request, res: Response) => {
//     const users = await Staff.find({});
//     res.send(users);
//   }
// );

// router.delete('/:userId', [], async (req: Request, res: Response) => {
//   const userId = req.params.userId;
//   const user = await Staff.findOne({
//     _id: userId,
//     type: { $ne: 'Default' },
//   });
//   console.log(user);
//   if (!user)
//     throw new BadRequestError('Not found or cannot delete default user');

//   user.status = 'Inactive';
//   await user.save();

//   console.log(user);

//   res.send(user);
// });

// router.get(
//   '/me',
//   [currentUser, requireAuth],
//   async (req: Request, res: Response, next: NextFunction) => {
//     res.send({ user: req.user || null });
//   }
// );

export { router as v1AuthRoutes };
