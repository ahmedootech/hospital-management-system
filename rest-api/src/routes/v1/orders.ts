import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../common/middlewares/validate-request';
import { currentUser } from '../../common/middlewares/current-user';
import { requireAuth } from '../../common/middlewares/require-auth';
import { authorization } from '../../common/middlewares/authorization';
import mongoose from 'mongoose';
import { Order, OrderItem } from '../../models/v1/order';
import { Service } from '../../models/v1/service';
import { BadRequestError } from '../../common/errors/bad-request-error';
import { OrderStatus, PaymentMethods } from '../../common/types/order-types';

const router = Router();

router.post(
  '/',
  [
    body('orderType').notEmpty().withMessage('Order type not specified'),
    body('paymentMode').notEmpty().withMessage('Payment mode not specified'),
    body('items').isArray().withMessage('Products has to be a list'),
    body('amountReceived').notEmpty().withMessage('No paid amount'),
    body('patient').notEmpty().withMessage('No patient selected'),
  ],
  [
    validateRequest,
    currentUser,
    requireAuth,
    authorization(['Admin', 'Manager', 'Receptionist']),
  ],
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { orderType, paymentMode, items, amountReceived, patient } = req.body;

    try {
      let orderTotal = 0;
      const orderedItems = await Promise.all(
        items.map(async (item: OrderItem) => {
          const service = await Service.findById(item.id).populate(
            'department'
          );

          if (!service)
            throw new BadRequestError(
              `Order failed, one of your service +${item.id}`
            );

          item.price = service.price;
          item.service = service;
          item.total = +service.price * +item.quantity;

          orderTotal += item.total;
          return item;
        })
      );

      const order = Order.build({
        staff: req.user.id,
        paymentMode,
        items: orderedItems,
        orderType,
        total: orderTotal,
        status: OrderStatus.Complete,
        amountReceived,
        patient,
      });

      await order.save({ session });
      await order.populate(['staff', 'patient']);
      await session.commitTransaction();
      res.status(201).send(order);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
);

router.get('/payment-methods', (req, res) => {
  res.json(Object.keys(PaymentMethods));
});

export { router as v1OrderRoutes };
