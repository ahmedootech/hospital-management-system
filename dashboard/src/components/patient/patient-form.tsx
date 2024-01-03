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

const defaultValues = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  marital: '',
  phone: '',
  address: '',
  username: '',
  password: '12345',
};
const PatientForm = () => {
  const patientSchema = yup.object().shape({
    firstName: yup.string().required('patient first name is required'),
    lastName: yup.string().required('patient last name is required'),
    gender: yup.string().required('gender is required'),
    dob: yup.string().required('date of birth is required'),
    marital: yup.string().required('marital status is required'),
    phone: yup.string().required('contact phone is required'),
    address: yup.string().required('address is required'),
    username: yup.string().required('contact phone is required'),
    password: yup.string().required('contact phone is required'),
  });

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(patientSchema),
  });

  const patientSubmitHandler = async (data: any) => {
    try {
      const res = await apiV1.post('/auth/patients/register', data);
      methods.reset(defaultValues);
      toast.success('Patient created successfully');
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
    <form onSubmit={methods.handleSubmit(patientSubmitHandler)}>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Patient's Name" />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="firstName"
            placeholder="First"
            control={methods.control}
          />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="lastName"
            placeholder="Last"
            control={methods.control}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Gender" />
        </div>
        <div className="col-lg-5">
          <div className="d-flex">
            <Radio
              name="gender"
              value="Male"
              label="Male"
              register={methods.register}
            />
            <Radio
              name="gender"
              value="Female"
              label="Female"
              register={methods.register}
            />
          </div>
          {methods.formState.errors['gender'] && (
            <p className="form-text text-danger p-0 m-0">
              {methods.formState.errors['gender'].message}
            </p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Phone" />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="phone"
            placeholder="0803#######"
            control={methods.control}
            onChange={(e) => {
              methods.setValue('username', e.target.value);
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Date Of Birth" />
        </div>
        <div className="col-lg-5">
          <Input
            type="date"
            name="dob"
            placeholder="0803#######"
            control={methods.control}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Marital Status" />
        </div>
        <div className="col-lg-6 ">
          <div className="d-flex">
            <Radio
              name="marital"
              value="Married"
              label="Married"
              register={methods.register}
            />
            <Radio
              name="marital"
              value="Single"
              label="Single"
              register={methods.register}
            />
            <Radio
              name="marital"
              value="Divorced"
              label="Divorced"
              register={methods.register}
            />
            <Radio
              name="marital"
              value="Widow"
              label="Widow"
              register={methods.register}
            />
          </div>
          {methods.formState.errors['marital'] && (
            <p className="form-text text-danger p-0 m-0">
              {methods.formState.errors['marital'].message}
            </p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Patient's address" />
        </div>
        <div className="col-lg-10">
          <Input
            type="text"
            name="address"
            placeholder="Patient full address"
            control={methods.control}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <HorizontalLabel label="Patient's Login" />
        </div>
        <div className="col-lg-5">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            control={methods.control}
          />
        </div>
        <div className="col-lg-5">
          <Input
            type="password"
            placeholder="Password"
            name="password"
            control={methods.control}
          />
          {/* <p className="form-text p-0 m-0">Default password 12345</p> */}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        {/* <button className="btn btn-primary py-3 px-5">Add Patient</button> */}
        <SubmitButton label="Add Patient" type="submit" />
      </div>
    </form>
  );
};
export default PatientForm;
