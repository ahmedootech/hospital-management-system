import mongoose from 'mongoose';
import {
  OrderStatus,
  OrderType,
  PaymentMode,
} from '../../common/types/order-types';

import { ServiceDoc } from './service';
import { transformDocument } from '../../services/mongoose-utils';

export interface OrderItem {
  service: ServiceDoc;
  quantity: number;
  price: number;
  id: string;
  total: number;
}

interface OrderAttrs {
  staff: string;
  items: OrderItem[];
  orderType: OrderType;
  paymentMode: PaymentMode;
  total: number;
  amountReceived: number;
  status: OrderStatus;
  patient: string;
}

interface OrderDoc extends OrderAttrs, mongoose.Document {}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    staff: {
      type: String,
      required: true,
      ref: 'Staff',
    },

    items: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Service',
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMode: {
      type: String,
      required: true,
      enum: Object.values(PaymentMode),
    },
    total: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      default: OrderType.Physical,
      enum: Object.values(OrderType),
    },
    amountReceived: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: OrderStatus.Pending,
      enum: Object.values(OrderStatus),
    },
    patient: {
      type: String,
      required: true,
      ref: 'Patient',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        transformDocument(ret);
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
