import mongoose from 'mongoose';
import { transformDocument } from '../../services/mongoose-utils';

interface DepartmentAttr {
  name: string;
  description?: string;
  type?: string;
}

interface DepartmentDoc extends DepartmentAttr, mongoose.Document {}

interface DepartmentModel extends mongoose.Model<DepartmentDoc> {
  build(attrs: DepartmentAttr): DepartmentDoc;
}

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type:{
      type: String,
      enum: ['Default', 'Custom'],
      default: 'Custom',
    }
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

departmentSchema.statics.build = (attrs: DepartmentAttr) => {
  return new Department(attrs);
};

const Department = mongoose.model<DepartmentDoc, DepartmentModel>(
  'Department',
  departmentSchema
);

export { Department };
