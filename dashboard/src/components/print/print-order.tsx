import React from 'react';
import { useCompany } from '../../hooks/useCompany';

interface PrintOrderProps {
  order: {
    createdAt: string;
    user: {
      fullname: string;
    };
    items: {
      quantity: number;
      product: {
        name: string;
      };
      price: number;
      total: number;
    }[];
    total: number;
    amountReceived: number;
    paymentMode: string;
  };
}
export const PrintOrder = React.forwardRef<HTMLDivElement, any>(
  (props, ref) => {
    const company = useCompany();
    const marginTop = '10px';
    const marginBottom = '10px';
    const marginLeft = '5px';
    const marginRight = '5px';
    const getPageMargins = () => {
      return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
    };
    return (
      <div className="container py-3 page" ref={ref}>
        <div className="d-flex flex-column align-items-center text-center">
          <h4>{company.companyName}</h4>
          <h6>{company.address.street}</h6>
          <h6>
            {company.address.state} {company.address.country}
          </h6>
          <h6 className="border px-5 py-2">RECEIPT</h6>
        </div>
        <div className="my-1">
          <p className="m-0 me-4 ">{`
          Ordered on
          ${new Date(props.order.createdAt).toLocaleDateString()}
          at
          ${new Date(props.order.createdAt).toLocaleTimeString()}`}</p>
          <p>{`Attended by ${props.order.staff.firstName}  ${props.order.staff.lastName}`}</p>
          <p>{`Patient: ${props.order.patient.firstName}  ${props.order.patient.lastName}`}</p>
        </div>
        <h6 className="text-center">Ordered Items</h6>
        <table className="table">
          <thead>
            <tr>
              <th>Desc</th>
              <th>Price</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            {props.order.items.map((orderItem, index) => (
              <tr key={index}>
                <td>{`${orderItem.quantity} x
                ${
                  orderItem.service.name.length > 15
                    ? String(orderItem.service.name).substring(0, 15) + '...'
                    : orderItem.service.name
                }
                `}</td>
                <td>{orderItem.price}</td>
                <td>{orderItem.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row justify-content-end">
          <div className="col-7">
            <table className="table fw-bold text-end">
              <tr>
                <td>Total:</td>
                <td>&#8358;{Number(props.order.total).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Received:</td>
                <td>
                  &#8358;{Number(props.order.amountReceived).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Balance:</td>
                <td>
                  &#8358;
                  {Number(
                    props.order.amountReceived - props.order.total
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Paid by:</td>
                <td>{props.order.paymentMode}</td>
              </tr>
            </table>
          </div>
          <h4 className="text-center">Thank You</h4>
        </div>

        <style jsx>{`
          @media print {
            .page {
              font-size: 11px;
            }
            h4 {
              font-size: 15px;
            }
            h6 {
              font-size: 13px;
            }
            @page {
              size: 80mm 150mm;
              font-size: 8px;
            }
          }
        `}</style>
      </div>
    );
  }
);
