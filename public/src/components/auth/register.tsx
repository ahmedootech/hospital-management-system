import { yupResolver } from '@hookform/resolvers/yup';
import { getApiV1Instance } from '../../utils/axios-instance';
import Input from '../form-controls/input';
import SubmitButton from '../form-controls/submit-button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const defaultValues = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  phone: '',
};
const RegisterForm = ({ registerHandler }) => {
  const registerSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    phone: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(registerSchema),
  });

  return (
    <>
      <div className="d-flex flex-column align-items-center"></div>
      <form
        action=""
        onSubmit={handleSubmit(registerHandler)}
        autoComplete="off"
      >
        <div className="row">
          <div className="col-lg-6">
            <Input
              type="text"
              label="First name"
              name="firstName"
              required={true}
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <Input
              type="text"
              label="Last name"
              name="lastName"
              required={true}
              control={control}
            />
          </div>

          <div className="col-lg-6">
            <Input
              type="text"
              label="Username"
              name="username"
              required={true}
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <Input
              type="password"
              name="password"
              label="Password"
              required
              control={control}
            />
          </div>
        </div>      
        {/* <p className="form-text py-0 my-0 text-primary fw-semibold">
          Forget password?
        </p> */}
        <SubmitButton label="Create account" />
      </form>
    </>
  );
};
export default RegisterForm;
