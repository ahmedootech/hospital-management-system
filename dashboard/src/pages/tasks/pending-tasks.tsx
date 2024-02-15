import Link from 'next/link';
import PageHeader from '../../layout/page-header';
import PendingTaskList from '../../components/task/pending-tasks-list';

const PendingTasks = () => {
  return (
    <>
      <PageHeader
        title="Pending Tasks"
        description="List of pending task for your department"
      >
        <Link href="/tasks/my-tasks" className="btn btn-success px-4">
          My Tasks
        </Link>
      </PageHeader>
      <PendingTaskList />
    </>
  );
};
export default PendingTasks;
