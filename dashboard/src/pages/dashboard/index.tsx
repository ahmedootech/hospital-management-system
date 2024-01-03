import Cookies from 'js-cookie';

const Dashboard = () => {
  const user = Cookies.get('user');

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
