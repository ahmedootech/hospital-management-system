import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiV1 } from '../../utils/axios-instance';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiV1.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <>
      {rooms.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-nowrap">{room.name}</td>
                  <td className="text-nowrap">
                    {Number(room.price).toLocaleString()}
                  </td>
                  <td>
                    {room.description ? room.description : 'No description'}
                  </td>
                  <td>{room.status}</td>
                  <td>{new Date(room.createdAt).toLocaleString()}</td>
                  <td className="text-nowrap">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="btn btn-light py-0 px-1 "
                      title="Explore"
                    >
                      <VisibilityIcon />
                    </Link>
                    <Link
                      href="/"
                      className="btn btn-warning text-white py-0 px-1 mx-1"
                      title="Edit Room"
                    >
                      <EditIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Record Found</p>
      )}
    </>
  );
};
export default RoomList;
