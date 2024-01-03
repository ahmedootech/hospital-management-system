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
import { useEffect, useState } from 'react';
import Select from '../form-controls/select';

const defaultValues = {
  name: '',
  price: 0,
  department: '',
  description: '',
};
const ServiceForm = () => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/departments');
        setDepartments(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  const serviceSchema = yup.object().shape({
    name: yup.string().required('service name is required'),
    price: yup
      .number()
      .typeError('only numbers allowed')
      .min(1, 'price cannot be less than 1')
      .required('service price is required'),
    department: yup.string().required('service department is required'),
    description: yup.string(),
  });

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(serviceSchema),
  });

  const serviceSubmitHandler = async (data: any) => {
    try {
      const res = await apiV1.post('/services/', data);
      methods.reset(defaultValues);
      toast.success('Service created successfully');
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
    <form onSubmit={methods.handleSubmit(serviceSubmitHandler)}>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Service Name" />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="name"
            placeholder="Service Name"
            control={methods.control}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Service Price" />
        </div>
        <div className="col-lg-5">
          <Input
            type="number"
            name="price"
            placeholder="Service price"
            control={methods.control}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Service Department" />
        </div>
        <div className="col-lg-5">
          <Select control={methods.control} name="department">
            <option value="">---Choose Department---</option>
            {departments.map((department, index) => (
              <option key={index} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>
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
          <SubmitButton label="Add Service" type="submit" />
        </div>
      </div>
    </form>
  );
};
export default ServiceForm;
