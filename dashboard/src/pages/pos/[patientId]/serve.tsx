import { useEffect, useRef, useState } from 'react';
import PageHeader from '../../../layout/page-header';
import { apiV1 } from '../../../utils/axios-instance';
import Link from 'next/link';
import Cart from '../../../components/cart/cart';

import AddCart from '@mui/icons-material/AddShoppingCartOutlined';
import Select from '../../../components/form-controls/select';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Input from '../../../components/form-controls/input';
import { Modal } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';

import { PrintOrder } from '../../../components/print/print-order';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';

import PrintIcon from '@mui/icons-material/Print';

const Pos = (props) => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [show, setShow] = useState(false);
  const [order, setOrder] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const componentRef = useRef();
  const printButtonRef = useRef();

  const defaultValues = {
    paymentMode: 'Cash',
    amountReceived: 0,
    discount: 0,
  };
  const orderSchema = yup.object().shape({
    paymentMode: yup.string().required('Select payment mode'),
    amountReceived: yup
      .number()
      .typeError('only numbers')
      .required('Field required'),
    discount: yup.number().typeError('only numbers').required('Field required'),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(orderSchema),
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/services');
        const paymentMethodsRes = await apiV1.get('/orders/payment-methods');

        setPaymentMethods(paymentMethodsRes.data);
        setServices(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
        toast.error('Something went wrong');
      }
    };
    getData();
  }, []);

  const addProductToCart = (product) => {
    const cartItems = [...cart];
    const productIndex = cartItems.findIndex((item) => item.id === product.id);
    if (productIndex > -1) {
      const product = { ...cartItems[productIndex] };

      product.quantity = product.quantity + 1;
      product.total = product.price * product.quantity;
      cartItems[productIndex] = product;
      return setCart(cartItems);
    }
    const newProduct = {
      ...product,
      quantity: 1,
      total: product.price,
    };

    cartItems.splice(0, 0, newProduct);
    setCart(cartItems);
  };

  useEffect(() => {
    const total =
      cart.length > 0 ? cart.reduce((sum, item) => (sum += item.total), 0) : 0;
    setTotal(total);
  }, [cart]);

  const updateCartItemQuantity = (quantity, index) => {
    const updatedCart = [...cart];
    const product = { ...updatedCart[index] };

    product.quantity = quantity;
    product.total = product.price * product.quantity;
    updatedCart[index] = product;
    setCart(updatedCart);
  };
  const deleteCartItem = (index) => {
    const newCartItems = cart.filter((item, itemIndex) => itemIndex !== index);
    setCart(newCartItems);
  };

  const payHandler = async (data) => {
    if (cart.length <= 0) {
      toast.error('Empty cart');
      return;
    }
    if (amountReceived < total - discount) {
      toast.error('Check amount you received');
      return;
    }
    const order = {
      ...data,
      items: cart,
      total,
      orderType: 'Physical',
      patient: router.query.patientId,
    };
    console.log('order', order);
    // return;
    try {
      const response = await apiV1.post(`/orders`, order);
      setCart([]);
      setOrder(response.data);
      setShow(true);
      reset(defaultValues);
      setAmountReceived(0);
      setOrderPlaced(true);
    } catch (err) {
      console.log(err);
    }
  };

  const pageStyle = `
  @page {
    size: 80mm 50mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;
  return (
    <>
      <PageHeader title="Point Of Sale">
        <p className="py-0 my-0">
          {props.patient.firstName} {props.patient.lastName}
        </p>
      </PageHeader>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <h5>Services</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index} className="align-middle">
                      <td className="text-nowrap">{service.name}</td>
                      <td className="text-nowrap">{service.price}</td>
                      <td className="text-nowrap">{service.department.name}</td>

                      <td className="text-nowrap">
                        <button
                          className="btn btn-light py-0 px-1 "
                          onClick={() => addProductToCart(service)}
                        >
                          <AddCart />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6">
            <h5>Cart</h5>
            <Cart
              cartItems={cart}
              onQuantityChanged={updateCartItemQuantity}
              total={total}
              onDelete={deleteCartItem}
            />
            <div className="py-4">
              <form onSubmit={handleSubmit(payHandler)}>
                <div className="d-flex justify-content-end">
                  <h4>Total Price: {Number(total).toLocaleString()}</h4>
                </div>
                <div className="row ">
                  <div className="col-md-6">
                    <Input
                      type="number"
                      label="Amount Received"
                      name="amountReceived"
                      onChange={(event) => {
                        if (+event.target.value < 0) {
                          setValue('amountReceived', 0);
                          return;
                        }

                        setAmountReceived(+event.target.value);
                      }}
                      onFocus={(event) => {
                        if (+event.target.value < 1) {
                          setValue('amountReceived', 0);
                        }
                      }}
                      onBlur={(event) => {
                        if (
                          +event.target.value < 1 ||
                          +event.target.value == 0
                        ) {
                          setValue('amountReceived', 0);
                          setError('amountReceived', null);
                        }
                      }}
                      control={control}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      type="number"
                      label="Discount"
                      name="discount"
                      onChange={(event) => {
                        if (+event.target.value < 0) {
                          setValue('discount', 0);
                          return;
                        }
                        setDiscount(+event.target.value);
                      }}
                      control={control}
                    />
                  </div>
                </div>

                <div className="form-group row justify-content-end">
                  <div className="col-md-6">
                    <Select
                      label="Payment Mode"
                      name="paymentMode"
                      control={control}
                    >
                      {paymentMethods.map((paymentMethod, index) => (
                        <option value={paymentMethod} key={index}>
                          {paymentMethod}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="col-md-6 py-1">
                    <label htmlFor="" className="form-label fw-bold">
                      Change
                    </label>
                    <input
                      type="number"
                      className="form-control py-2"
                      name="change"
                      placeholder="Change"
                      disabled
                      value={amountReceived - (total - discount)}
                    />
                  </div>
                </div>
                <div className="py-3 justify-content-between">
                  <button className="btn btn-success">Pay</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>Order Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrintOrder order={order} ref={componentRef} />
          <div className="d-flex">
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-success px-5" ref={printButtonRef}>
                  <PrintIcon />
                </button>
              )}
              content={() => componentRef.current}
              pageStyle={pageStyle}
            ></ReactToPrint>
          </div>
        </Modal.Body>
      </Modal>
      <style jsx>{`
        page {
          background-color: blue;
        }
      `}</style>
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
    const patientRes = await apiV1.get(`/patients/${patientId}`, {
      headers: { Authorization: cookies.token },
    });
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
export default Pos;
