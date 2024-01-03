import mongoose from 'mongoose';
import { transformDocument } from '../../services/mongoose-utils';

interface ServiceAttr {
  name: string;
  price: number;
  department: string;
  description?: string;
}

export interface ServiceDoc extends ServiceAttr, mongoose.Document {}

interface ServiceModel extends mongoose.Model<ServiceDoc> {
  build(attrs: ServiceAttr): ServiceDoc;
}

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    department: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Department',
    },
    description: { type: String },
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

serviceSchema.statics.build = (attrs: ServiceAttr) => {
  return new Service(attrs);
};

const Service = mongoose.model<ServiceDoc, ServiceModel>(
  'Service',
  serviceSchema
);

export { Service };
