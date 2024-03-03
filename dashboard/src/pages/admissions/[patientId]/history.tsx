import { NextPageContext } from 'next';
import moment from 'moment';
import PageHeader from '../../../layout/page-header';
import { apiV1, getApiV1Instance } from '../../../utils/axios-instance';
import AdmissionForm from '../../../components/admission/admission-form';
import { useEffect, useState } from 'react';
import OrderSummary from '../../../components/order/order-summary';
import Input from '../../../components/form-controls/input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import SubmitButton from '../../../components/form-controls/submit-button';
import { toast } from 'react-toastify';
import Select from '../../../components/form-controls/select';
import { useRouter } from 'next/router';

const defaultValues = {
  amountReceived: 0,
  paymentMode: '',
};
const Admit = ({ patient }) => {
  const router = useRouter();

  const [admission, setAdmission] = useState(null);
  const [orders, setOrders] = useState([]);
  const [servicesTotal, setServicesTotal] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const createdAtDate = moment(admission?.createdAt);
  const today = moment();
  const differenceInDays = today.diff(createdAtDate, 'days');

  const totalRoomCharge = admission?.room.price * differenceInDays;

  useEffect(() => {
    const calculateServicesTotal = () => {
      let total = 0;
      orders.forEach((order) => {
        order.items.forEach((item) => {
          total += item.price * item.quantity;
        });
      });
      setServicesTotal(total);
    };

    calculateServicesTotal();
  }, [orders]);
  const admissionOrders = async () => {
    try {
      const admissionRes = await getApiV1Instance().get(
        `/admissions/${patient.id}`
      );

      const paymentMethodsRes = await apiV1.get('/orders/payment-methods');

      const res = await getApiV1Instance().get(
        `/orders/${patient.id}/on-admission`
      );

      setOrders(res.data);
      setAdmission(admissionRes.data);
      setPaymentMethods(paymentMethodsRes.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    admissionOrders();
  }, []);

  const disChargeSchema = yup.object().shape({
    amountReceived: yup
      .number()
      .typeError('only numbers')
      .min(1, 'amount invalid')
      .required('amount received required'),
    paymentMode: yup.string().required('Select payment mode'),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(disChargeSchema),
    mode: 'onBlur',
  });
  const dischargePatientHandler = async (data) => {
    if (
      data.amountReceived <
      totalRoomCharge + servicesTotal - (admission?.initialDeposit || 0)
    ) {
      toast.error('Check amount received');
      return;
    }
    try {
      const dischargeRes = await getApiV1Instance().post(
        `/admissions/${patient.id}/discharge`,
        data
      );

      toast.success('Patient discharge successfully');
      router.replace('/patients/in-patients');
    } catch (err) {
      console.log(err);
    }
    console.log(data);
  };
  return (
    <>
      <PageHeader
        title="Admission History"
        description={`${patient.firstName} ${patient.lastName}`}
      />
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-9">
            {orders.length > 0 ? (
              <>
                <h6>Services rendered</h6>

                {orders.map((order, index) => (
                  <OrderSummary order={order} key={index} />
                ))}
                <h6 className="text-end">
                  Services Grand Total: {Number(servicesTotal).toLocaleString()}
                </h6>
              </>
            ) : (
              <p>No record found</p>
            )}
          </div>
          <div className="col-lg-3">
            <h6>
              Initial deposit:{' '}
              {Number(admission?.initialDeposit || 0).toLocaleString()}
            </h6>
            <p>
              Room: {admission?.room.name} (
              {Number(admission?.room.price).toLocaleString()}) x{' '}
              {differenceInDays} days ={' '}
              {Number(totalRoomCharge).toLocaleString()}
            </p>
            <p>Total services: {Number(servicesTotal).toLocaleString()}</p>

            <h5 className="text-end">
              Balance:{' '}
              {Number(
                (admission?.initialDeposit || 0) -
                  servicesTotal -
                  totalRoomCharge
              ).toLocaleString()}
            </h5>
            <form onSubmit={methods.handleSubmit(dischargePatientHandler)}>
              <Input
                type="number"
                label="Amount received"
                control={methods.control}
                name="amountReceived"
              />
              <Select
                label="Payment Mode"
                name="paymentMode"
                control={methods.control}
              >
                <option value="">Select payment method---</option>
                {paymentMethods.map((paymentMethod, index) => (
                  <option value={paymentMethod} key={index}>
                    {paymentMethod}
                  </option>
                ))}
              </Select>
              <SubmitButton label="Discharge" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const cookies = context.req?.cookies;

  const { query } = context;
  const patientId = query.patientId;

  if (!patientId) {
    return {
      redirect: {
        destination: '/patients',
        permanent: false,
      },
    };
  }
  try {
    const patientRes = await getApiV1Instance().get(`/patients/${patientId}`, {
      headers: { Authorization: cookies.token },
    });
    console.log(patientRes.data);

    return {
      props: {
        patient: patientRes.data,
      },
    };
  } catch (err) {
    console.log(err.response.data);
    return {
      redirect: {
        destination: '/patients',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
export default Admit;
