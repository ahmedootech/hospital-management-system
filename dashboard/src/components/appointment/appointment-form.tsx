import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import HorizontalLabel from '../form-controls/horizontal-label';
import Input from '../form-controls/input';
import { useEffect, useState } from 'react';
import { apiV1 } from '../../utils/axios-instance';
import Select from '../form-controls/select';
import SubmitButton from '../form-controls/submit-button';
import { toast } from 'react-toastify';
import { handleYupErrors } from '../../utils/yup-form-helpers';

const defaultValues = {
  dateTime: new Date(),
  doctor: '',
};
const AppointmentForm = ({ patientId }) => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const docRes = await apiV1.get('/staffs/doctors');
        setDoctors(docRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const appointmentSchema = yup.object().shape({
    dateTime: yup
      .date()
      .typeError('invalid date')
      .required('appointment date is required'),
    doctor: yup.string().required('doctor not selected'),
  });
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(appointmentSchema),
  });

  const appointmentSubmitHandler = async (data: any) => {
    try {
      const res = await apiV1.post('/appointments/schedule-appointment', {
        ...data,
        patient: patientId,
      });
      methods.reset(defaultValues);
      toast.success('Appointment scheduled successfully');
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
    <form onSubmit={methods.handleSubmit(appointmentSubmitHandler)}>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Appointment date" />
        </div>
        <div className="col-lg-5">
          <Input
            type="datetime-local"
            name="dateTime"
            placeholder="Appointment date"
            control={methods.control}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Scheduling Doctor" />
        </div>
        <div className="col-lg-5">
          <Select control={methods.control} name="doctor">
            <option value="">---Select Doctor---</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor.id}>
                {`${doctor.firstName} ${doctor.lastName}`}
              </option>
            ))}
          </Select>
        </div>
        <div className="row gx-2">
          <div className="col-lg-7">
            <SubmitButton label="Make Appointment" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;