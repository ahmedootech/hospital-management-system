import { useEffect, useState } from 'react';
import { TaskHeader, TaskItem } from './partials';
import { apiV1, getApiV1Instance } from '../../utils/axios-instance';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const PendingTaskList = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const res = await getApiV1Instance().get('/tasks/pending');
      console.log(res);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const pickTaskHandler = async (taskId) => {
    try {
      const res = await apiV1.put(`/tasks/${taskId}/pick`);
      toast.success('Task Picked Successfully');
      router.push('/tasks/my-tasks');
    } catch (err) {
      toast.error(err.response.data.errors[0].message);
      console.log(err);
    }
  };
  return (
    <>
      {tasks.length ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <TaskHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TaskItem
                  task={task}
                  key={index}
                  pickTaskHandler={() => pickTaskHandler(task._id)}
                />
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

export default PendingTaskList;
