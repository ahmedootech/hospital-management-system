import mongoose from 'mongoose';

interface MedicalRecordAttrs {
  patientId: string;
  date: Date;
  doctorId: string;
  prescription: [
    {
      medicationName: String;
      dosage: String;
      frequency: String;
    }
  ];
  labResults: [
    {
      testType: String;
      result: String;
    }
  ];
  imagingReports: [
    {
      imagingType: String;
      report: String;
      imageUrl: String;
    }
  ];
}

interface MedicalRecordDoc extends MedicalRecordAttrs, mongoose.Document {}

interface MedicalRecordModel extends mongoose.Model<MedicalRecordDoc> {
  build(attrs: MedicalRecordAttrs): MedicalRecordDoc;
}

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: { type: Date, default: Date.now },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Reference to the doctor who created the record
  clinicalNotes: String,
  diagnosis: String,
  prescriptions: [
    {
      medicationName: String,
      dosage: String,
      frequency: String,
    },
  ],
  labResults: [
    {
      testType: String,
      result: String,
    },
  ],
  imagingReports: [
    {
      imagingType: String,
      report: String,
      imageUrl: String,
    },
  ],
});

medicalRecordSchema.statics.build = (attr: MedicalRecordAttrs) => {
  return new MedicalRecord(attr);
};

const MedicalRecord = mongoose.model<MedicalRecordDoc, MedicalRecordModel>(
  'MedicalRecord',
  medicalRecordSchema
);

export { MedicalRecord };
