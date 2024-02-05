import mongoose from 'mongoose';
import { transformDocument } from '../../services/mongoose-utils';
import { AdmissionStatus } from '../../common/types/order-types';

interface AdmissionAttr {
  initialDeposit: number;
  room: string;
  doctor: string;
  patient: string;
  status?:
    | AdmissionStatus.Admitted
    | AdmissionStatus.Discharged
    | AdmissionStatus.Transferred;
  createdAt?: Date;
}

interface AdmissionDoc extends AdmissionAttr, mongoose.Document {}

interface AdmissionModel extends mongoose.Model<AdmissionDoc> {
  build(attrs: AdmissionAttr): AdmissionDoc;
}

const admissionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    initialDeposit: {
      type: Number,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Staff',
    },
    status: {
      type: String,
      default: 'Admitted',
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

admissionSchema.statics.build = (attrs: AdmissionAttr) => {
  return new Admission(attrs);
};

const Admission = mongoose.model<AdmissionDoc, AdmissionModel>(
  'Admission',
  admissionSchema
);

export { Admission };
