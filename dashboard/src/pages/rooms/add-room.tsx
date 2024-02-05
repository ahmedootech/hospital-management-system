import PageHeader from '../../layout/page-header';
import Link from 'next/link';
import RoomForm from '../../components/room/room-form';

const AddRoom = () => {
  return (
    <>
      <PageHeader title="Add New Room" description="Add new hospital room">
        <Link href="/rooms" className="btn btn-success px-4">
          Room List
        </Link>
      </PageHeader>
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-9">
            <div className="">
              <RoomForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddRoom;
