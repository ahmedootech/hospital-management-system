import { useEffect, useState } from 'react';
import { TaskHeader, TaskItem } from './partials';
import { apiV1 } from '../../utils/axios-instance';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React from 'react';

const MyTaskList = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const res = await apiV1.get('/tasks/my-task');
      console.log('my pending task', res);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const completeTaskHandler = async (taskId) => {
    try {
      const res = await apiV1.put(`/tasks/${taskId}/completed`);
      toast.success('Task Completed Successfully');
      getData();
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
              {tasks.map((task: any, index) => (
                <TaskItem
                  task={task}
                  key={index}
                  completeTaskHandler={() => completeTaskHandler(task._id)}
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

export default MyTaskList;
