import DeleteIcon from '@mui/icons-material/Delete';
const cartItem = (props) => {
  console.log('cart item', props.item);
  return (
    <tr>
      <td>{props.sn}</td>
      <td>{props.item.name}</td>
      <td>{props.item.department.name}</td>
      <td>
        &#8358;
        {Number(props.item.price).toLocaleString()}
      </td>
      <td>
        <input
          type="number"
          className="p-0 mx-2 form-control border-success  text-center"
          style={{ width: '40px' }}
          value={props.item.quantity}
          onChange={props.changed}
        />
        {/* <i
          className="bx bx-plus cursor-pointer btn btn-success"
          style={{ cursor: 'pointer' }}
        ></i> */}
      </td>
      <td>{Number(props.item.total).toLocaleString()}</td>
      <td>
        <button className="btn btn-danger p-0" onClick={props.clicked}>
          <DeleteIcon fontSize="10" />
        </button>
      </td>
    </tr>
  );
};

export default cartItem;
