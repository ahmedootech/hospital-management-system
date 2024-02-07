import mongoose from 'mongoose';
import { transformDocument } from '../../services/mongoose-utils';
import { AppointmentStatus } from '../../common/types/order-types';

interface AppointmentAttr {
  patient: string;
  doctor: string;
  dateTime: Date;
  type: string;
  duration?: number;
  meetingLink?: string;
  status?:
    | AppointmentStatus.Scheduled
    | AppointmentStatus.Cancelled
    | AppointmentStatus.Completed
    | AppointmentStatus.Rescheduled;
  createdBy: string;
  createdAt?: Date;
}

interface AppointmentDoc extends AppointmentAttr, mongoose.Document {}

interface AppointmentModel extends mongoose.Model<AppointmentDoc> {
  build(attrs: AppointmentAttr): AppointmentDoc;
}

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Staff',
    },
    dateTime: {
      type: Date,
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'Staff',
    },
    status: {
      type: String,
      default: AppointmentStatus.Scheduled,
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

appointmentSchema.statics.build = (attrs: AppointmentAttr) => {
  return new Appointment(attrs);
};

const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>(
  'Appointment',
  appointmentSchema
);

export { Appointment };
