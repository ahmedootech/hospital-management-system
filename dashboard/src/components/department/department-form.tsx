import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SubmitButton from '../form-controls/submit-button';
import HorizontalLabel from '../form-controls/horizontal-label';
import Input from '../form-controls/input';
import Radio from '../form-controls/radio';
import { apiV1 } from '../../utils/axios-instance';
import { toast } from 'react-toastify';
import { handleYupErrors } from '../../utils/yup-form-helpers';
import TextArea from '../form-controls/textarea';

const defaultValues = {
  name: '',
  description: '',
};
const DepartmentForm = () => {
  const departmentSchema = yup.object().shape({
    name: yup.string().required('department name is required'),
    description: yup.string(),
  });

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(departmentSchema),
  });

  const departmentSubmitHandler = async (data: any) => {
    try {
      const res = await apiV1.post('/departments/', data);
      methods.reset(defaultValues);
      toast.success('Department created successfully');
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
    <form onSubmit={methods.handleSubmit(departmentSubmitHandler)}>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Department Name" />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="name"
            placeholder="Department name"
            control={methods.control}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Description" />
        </div>
        <div className="col-lg-5">
          <TextArea name="description" control={methods.control} />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7">
          <SubmitButton label="Add Department" type="submit" />
        </div>
      </div>
    </form>
  );
};
export default DepartmentForm;
