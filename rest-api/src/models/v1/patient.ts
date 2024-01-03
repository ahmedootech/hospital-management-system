import mongoose from 'mongoose';
import { PasswordManager } from '../../services/password-manager';
import { transformDocument } from '../../services/mongoose-utils';

export interface PatientAttrs {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  dob: Date;
  marital: string;
  address: string;
  username: string;
  password: string;
  status?: string;
  jwt?: string;
}

interface PatientModel extends mongoose.Model<PatientDoc> {
  build(attrs: PatientAttrs): PatientDoc;
}

interface PatientDoc extends PatientAttrs, mongoose.Document {}
const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    marital: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        transformDocument(ret);
      },
    },
  }
);

patientSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

patientSchema.statics.build = (attrs: PatientAttrs) => {
  return new Patient(attrs);
};

const Patient = mongoose.model<PatientDoc, PatientModel>(
  'Patient',
  patientSchema
);

export { Patient };
