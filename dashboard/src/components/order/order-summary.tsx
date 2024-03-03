import { useEffect } from 'react';

const OrderSummary = ({ order }) => {
  let total = 0;
  return (
    <div className="bg-light p-3 my-2">
      <h6>Date: {new Date(order.createdAt).toDateString()}</h6>
      <p className="my-0">
        Served by: {`${order.staff.firstName} ${order.staff.lastName}`}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => {
            total += +item.price * item.quantity;
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{item.service.name}</td>
                <td>{Number(item.price).toLocaleString()}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
                <td>{Number(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="fw-semibold">
            <td colSpan={4}></td>
            <td>Services Total</td>
            <td>{Number(total).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default OrderSummary;
