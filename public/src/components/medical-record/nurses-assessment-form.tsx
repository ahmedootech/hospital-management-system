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

const defaultValues = {
  assessments: [{ name: '', value: '' }],
};
const NursesAssessmentForm = ({ patientId }) => {
  const assessmentSchema = yup.object().shape({
    name: yup.string().required('Assessment name is required'),
    value: yup.string().required('Assessment value is required'),
  });

  const formSchema = yup.object().shape({
    assessments: yup
      .array()
      .of(assessmentSchema)
      .required('Assessments are required'),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(formSchema),
  });
  // Use useFieldArray hook to manage dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'assessments',
  });
  const saveAssessmentHandler = async (data) => {
    try {
      const res = await apiV1.put(
        `/medical-records/${patientId}/vital-signs`,
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
    <form onSubmit={methods.handleSubmit(saveAssessmentHandler)}>
      <section>
        <h5>Vital Signs</h5>
        <div className="container-fluid">
          {fields.map((vitalSign, index) => (
            <div className="row align-items-end g-1" key={vitalSign.id}>
              <div className="col-lg-5">
                <Input
                  type="text"
                  control={methods.control}
                  name={`assessments.${index}.name`}
                  label="Assessment name"
                  list="assessmentsList"
                />
              </div>
              <div className="col-lg-5">
                <Input
                  type="text"
                  control={methods.control}
                  label="Assessment value"
                  name={`assessments.${index}.value`}
                />
              </div>
              <div className="col-lg-2 d-flex h-100 align-items-center">
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
                  onClick={() => append({ name: '', value: '' })}
                >
                  <AddIcon />
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-end">
            <SubmitButton label="Save assessment" />
          </div>
        </div>
      </section>
      <datalist id="assessmentsList">
        <option value="Blood Pressure (BP)" />
        <option value="Heart Rate (Pulse)" />
        <option value="Respiratory Rate" />
        <option value="Temperature" />
        <option value="Oxygen Saturation (SpO2)" />
        <option value="Height" />
        <option value="Weight" />
        <option value="Blood Sugar (Glucose)" />
        <option value="Pain Assessment" />
      </datalist>
    </form>
  );
};

export default NursesAssessmentForm;
