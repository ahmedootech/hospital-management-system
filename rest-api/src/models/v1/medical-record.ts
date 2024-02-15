import mongoose from 'mongoose';

interface MedicalRecordAttrs {
  patient: string;
  date: Date;
  clinicalNotes: string;
  diagnosis: [
    {
      description: string;
      prescription: [
        {
          medicationName: string;
          dosage: string;
          frequency: string;
        }
      ];
      doctor: string;
    }
  ];
  labResults: [
    {
      testType: string;
      result: string;
      servedBy: string;
    }
  ];
  imagingReports: [
    {
      imagingType: string;
      report: string;
      imageUrl: string;
      servedBy: string;
    }
  ];
}

interface MedicalRecordDoc extends MedicalRecordAttrs, mongoose.Document {}

interface MedicalRecordModel extends mongoose.Model<MedicalRecordDoc> {
  build(attrs: MedicalRecordAttrs): MedicalRecordDoc;
}

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: { type: Date, default: Date.now },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // Reference to the doctor who created the record
  clinicalNotes: { type: String, required: true },
  diagnosis: { type: String, required: true },
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
      servedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
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
