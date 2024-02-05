import Link from 'next/link';
import PageHeader from '../../layout/page-header';
import RoomList from '../../components/room/room-list';

const Room = () => {
  return (
    <>
      <PageHeader title="Room List" description="List and manage rooms">
        <Link href="/rooms/add-room" className="btn btn-success px-4">
          Add New Room
        </Link>
      </PageHeader>
      <RoomList />
    </>
  );
};
export default Room;
