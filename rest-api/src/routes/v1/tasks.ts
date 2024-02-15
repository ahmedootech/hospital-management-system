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

const router = Router();

router.get(
  '/pending',
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const pendingTasks = await findPendingOrderItemsForDepartment(
      req.user.department
    );
    res.send(pendingTasks);
  }
);

router.get(
  '/my-task',
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const pendingTasks = await findMyPendingTask(req.user.id);
    res.send(pendingTasks);
  }
);

router.put(
  '/:taskId/pick',
  [currentUser, requireAuth],
  async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const updatedTask = await updateOrderItemStatus(
      taskId,
      req.user.id,
      OrderStatus['In Progress']
    );
    res.send(updatedTask);
  }
);

export { router as v1TaskRoutes };
