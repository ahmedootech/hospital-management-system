import { useRouter } from 'next/router';
import MedicalRecords from '../../../components/medical-record/medical-records';
import PageHeader from '../../../layout/page-header';

const PatientMedicalRecord = () => {
  const router = useRouter();
  const { patientId, patientName } = router.query;
  return (
    <>
      <PageHeader
        title="Patient Medical Record"
        description={(patientName as string) || 'Patient'}
      />
      <MedicalRecords patientId={patientId} />
    </>
  );
};
export default PatientMedicalRecord;
