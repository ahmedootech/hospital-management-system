import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form-controls/input';
import SubmitButton from '../form-controls/submit-button';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { apiV1 } from '../../utils/axios-instance';
import { toast } from 'react-toastify';
import { handleYupErrors } from '../../utils/yup-form-helpers';
import TextArea from '../form-controls/textarea';

const defaultValues = {
  note: '',
  diagnosis: '',
  prescriptions: [{ medicationName: '', dosage: '', frequency: '' }],
};
const ClinicalNoteForm = ({ patientId }) => {
  const prescriptionSchema = yup.object().shape({
    medicationName: yup.string().required('medication name is required'),
    dosage: yup.string().required('dosage is required'),
    frequency: yup.string().required('frequency is required'),
  });
  const formSchema = yup.object().shape({
    note: yup.string().required('clinical note is required'),
    diagnosis: yup.string().required('diagnosis is required'),
    prescriptions: yup
      .array()
      .of(prescriptionSchema)
      .required('prescriptions are required'),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'prescriptions',
  });

  const saveNoteHandler = async (data) => {
    console.log(data);

    try {
      const res = await apiV1.put(
        `/medical-records/${patientId}/clinical-notes`,
        data
      );
      methods.reset(defaultValues);
      toast.success('Patient record added successfully');
    } catch (err) {
      console.log(err);
      const errors = err.response.data.errors;
      if (errors[0].field) {
        handleYupErrors({
          formFields: data,
          serverError: errors,
          yupSetError: methods.setError,
        });
      } else {
        toast.error(errors[0].message);
      }
    }
  };
  return (
    <form onSubmit={methods.handleSubmit(saveNoteHandler)}>
      <section>
        {/* <h5>Clinical Note</h5> */}
        <div className="container-fluid">
          <TextArea control={methods.control} label="Note" name="note" />
          <TextArea
            control={methods.control}
            label="Diagnosis"
            name="diagnosis"
          />
          {fields.map((prescription, index) => (
            <div className="row align-items-start g-1" key={prescription.id}>
              <div className="col-lg-4">
                <Input
                  type="text"
                  control={methods.control}
                  name={`prescriptions.${index}.medicationName`}
                  label="Medication name"
                  //   list="assessmentsList"
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  control={methods.control}
                  label="Dosage"
                  name={`prescriptions.${index}.dosage`}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  control={methods.control}
                  label="Frequency"
                  name={`prescriptions.${index}.frequency`}
                />
              </div>
              <div className="col-lg-2 d-flex h-100 align-self-center mt-4">
                {index > 0 && (
                  <button
                    className="btn btn-danger mb-2 p-1 py-2 me-1"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <DeleteForeverIcon />
                  </button>
                )}
                <button
                  className="btn btn-primary p-1 py-2 mb-2"
                  type="button"
                  onClick={() =>
                    append({ medicationName: '', dosage: '', frequency: '' })
                  }
                >
                  <AddIcon />
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end">
            <SubmitButton label="Save Note" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default ClinicalNoteForm;
