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
  initialDeposit: 0,
  room: '',
  doctor: '',
};
const AdmissionForm = ({ patientId }) => {
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const availableRoomsRes = await apiV1.get('/rooms/available');
        const docRes = await apiV1.get('/staffs/doctors');
        setRooms(availableRoomsRes.data);
        setDoctors(docRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const admissionSchema = yup.object().shape({
    initialDeposit: yup
      .number()
      .typeError('only numbers allowed')
      .min(1, 'deposit cannot be less than 1')

      .required('initial deposit has to be paid'),
    room: yup.string().required('room not selected'),
    doctor: yup.string().required('doctor not selected'),
  });
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(admissionSchema),
  });

  const admissionSubmitHandler = async (data: any) => {
    console.log(data);
    try {
      const res = await apiV1.post('/admissions/admit', {
        ...data,
        patient: patientId,
      });
      methods.reset(defaultValues);
      toast.success('Patient admitted successfully');
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
    <form onSubmit={methods.handleSubmit(admissionSubmitHandler)}>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Initial Deposit" />
        </div>
        <div className="col-lg-5">
          <Input
            type="number"
            name="initialDeposit"
            placeholder="Initial Deposit"
            control={methods.control}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Admission Room" />
        </div>
        <div className="col-lg-5">
          <Select control={methods.control} name="room">
            <option value="">---Choose Room---</option>
            {rooms.map((room, index) => (
              <option key={index} value={room.id}>
                {room.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 d-flex align-items-center">
          <HorizontalLabel label="Admitted By" />
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
            <SubmitButton label="Admit Patient" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdmissionForm;
