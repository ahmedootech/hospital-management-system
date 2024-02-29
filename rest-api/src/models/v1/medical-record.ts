import mongoose, { Document, Schema, Model } from 'mongoose';

interface Prescription {
  medicationName: string;
  dosage: string;
  frequency: string;
}

interface VitalSign {
  createdAt?: Date;
  signs: [{ name: string; value: string }];
  servedBy: string;
}

interface Investigation {
  investigation: string;
  result?: string;
  remark?: string;
  imageURL?: string;
  servedBy?: string;
}

interface MedicalRecordAttrs {
  patient: string;
  dateOfVisit: Date;
  clinicalNotes?: [
    {
      note: string;
      diagnosis: string;
      prescriptions: Prescription[];
      servedBy: string;
    }
  ];
  investigations?: Investigation[];
  vitalSigns?: VitalSign[];
}

interface MedicalRecordDoc extends MedicalRecordAttrs, Document {
  _id: mongoose.Types.ObjectId;
}

interface MedicalRecordModel extends Model<MedicalRecordDoc> {
  build(attrs: MedicalRecordAttrs): MedicalRecordDoc;
  findOrCreateTodayClinicalNote(
    patientId: string
    // clinicalNotes: ClinicalNote[]
  ): Promise<MedicalRecordDoc>;
}

const prescriptionSchema = new Schema({
  medicationName: String,
  dosage: String,
  frequency: String,
});

const investigationSchema = new Schema({
  investigation: { type: Schema.Types.ObjectId, required: true, ref: 'Service' },
  result: String,
  remark: String,
  imageURL: String,
  servedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  createdAt: { type: Date, default: Date.now },
});

const medicalRecordSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  dateOfVisit: { type: Date, default: Date.now },
  clinicalNotes: [
    {
      createdAt: { type: Date, default: Date.now },
      note: String,
      diagnosis: String,
      prescriptions: [prescriptionSchema],
      servedBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    },
  ],
  vitalSigns: [
    {
      createdAt: { type: Date, default: Date.now },
      signs: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      servedBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    },
  ],
  investigations: [investigationSchema],
});

medicalRecordSchema.statics.build = (attrs: MedicalRecordAttrs) => {
  return new MedicalRecord(attrs);
};

medicalRecordSchema.statics.findOrCreateTodayClinicalNote = async function (
  patientId: string
  // clinicalNotes: ClinicalNote[]
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  // Define the start and end of today
  const startOfDay = new Date(today);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

  let medicalRecord = await MedicalRecord.findOne({
    patient: patientId,
    dateOfVisit: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (!medicalRecord) {
    medicalRecord = MedicalRecord.build({
      patient: patientId,
      dateOfVisit: new Date(),
    });
  }

  // medicalRecord.clinicalNotes.push(...clinicalNotes);

  // await medicalRecord.save();

  return medicalRecord;
};
const MedicalRecord = mongoose.model<MedicalRecordDoc, MedicalRecordModel>(
  'MedicalRecord',
  medicalRecordSchema
);

export { MedicalRecord };
