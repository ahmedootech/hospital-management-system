import '../../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layouts/layout';
import AuthProvider from '../providers/auth-provider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
