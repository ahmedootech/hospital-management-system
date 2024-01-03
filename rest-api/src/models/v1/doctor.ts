import mongoose from 'mongoose';
import { Staff, StaffAttrs } from './staff';
import { transformDocument } from '../../services/mongoose-utils';

interface DoctorAttrs extends StaffAttrs {
  speciality: string;
}
interface DoctorDoc extends DoctorAttrs, mongoose.Document {}

interface DoctorModel extends mongoose.Model<DoctorDoc> {
  build(attrs: DoctorAttrs): DoctorDoc;
}

const doctorSchema = new mongoose.Schema(
  {
    speciality: {
      type: String,
      required: true,
    },
  },
  {
    discriminatorKey: 'role',
    toJSON: {
      transform(doc, ret) {
        transformDocument(ret);
      },
    },
  }
);

doctorSchema.statics.build = (attrs: DoctorAttrs) => {
  return new Doctor(attrs);
};

const Doctor = Staff.discriminator<DoctorDoc, DoctorModel>(
  'Doctor',
  doctorSchema
);

export { Doctor };
