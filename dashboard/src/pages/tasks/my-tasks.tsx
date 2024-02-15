import Link from 'next/link';
import PageHeader from '../../layout/page-header';
import MyTaskList from '../../components/task/my-tasks-list';

const MyTasks = () => {
  return (
    <>
      <PageHeader title="My Tasks" description="My task list">
        <Link href="/tasks/pending-tasks" className="btn btn-success px-4">
          Pending Tasks
        </Link>
      </PageHeader>
      <MyTaskList />
    </>
  );
};

export default MyTasks;
