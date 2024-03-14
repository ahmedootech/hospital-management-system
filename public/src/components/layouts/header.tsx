import { Navbar, Container, Nav, NavDropdown, Modal } from 'react-bootstrap';
import Link from 'next/link';
import RoofingIcon from '@mui/icons-material/Roofing';
import { useEffect, useState } from 'react';
import LoginForm from '../auth/login';
import { getApiV1Instance } from '../../utils/axios-instance';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import RegisterForm from '../auth/register';
import Logo from './logo';
import { useCompany } from '../../hooks/useCompany';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const auth = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const company = useCompany();

  useEffect(() => {
    const token = Cookies.get('token');
    auth.setIsLoggedIn(!!token); // Update isLoggedIn based on token presence
  }, []);

  const showLoginHandler = () => {
    auth.setShowLogin(true);
  };
  const closeLoginHandler = () => {
    auth.setShowLogin(false);
  };

  const showRegisterHandler = () => {
    setShowRegister(true);
  };
  const closeRegisterHandler = () => {
    setShowRegister(false);
  };

  const loginHandler = async (data) => {
    try {
      const response = await getApiV1Instance().post('/auth/staff/login', data);
      Cookies.set('token', response.data.jwt);
      const me = await getApiV1Instance().get('/auth/me', {
        headers: { Authorization: response.data.jwt },
      });
      Cookies.set('user', JSON.stringify(me.data));

      toast.success('login successful');
      //   router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  const onLoginSuccessHandler = () => {
    closeLoginHandler();
    auth.setIsLoggedIn(true);
  };

  const handleLogOut = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    auth.setIsLoggedIn(false);
  };
  return (
    <>
      <Navbar bg="white" expand="lg">
        <Container fluid className="py-3 px-5">
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand className="text-secondary fw-bold">
              <Logo />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className=" d-lg-flex justify-content-lg-end"
          >
            <Nav className="flex-grow-1 justify-content-lg-end d-flex align-items-lg-center">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link as="a">Home</Nav.Link>
              </Link>
              <Link href="/about-us" passHref legacyBehavior>
                <Nav.Link as="a">About Us</Nav.Link>
              </Link>
              <Link href="/contact-us" passHref legacyBehavior>
                <Nav.Link as="a">Contact Us</Nav.Link>
              </Link>
            </Nav>
            <Nav>
              {!auth.isLoggedIn ? (
                <>
                  <Nav.Item className="my-2 my-lg-0">
                    <button
                      className="btn px-4 py-2 me-lg-2 text-success fw-bold"
                      onClick={showLoginHandler}
                    >
                      Sign in to my {company.companyName} Health <LoginIcon />
                    </button>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <Link href="/dashboard" passHref legacyBehavior>
                    <Nav.Link as="a">Dashboard</Nav.Link>
                  </Link>
                  <Nav.Item className="my-2 my-lg-0">
                    <button
                      className="btn btn-primary px-4 py-2 me-lg-2"
                      onClick={handleLogOut}
                    >
                      Sign out
                    </button>
                  </Nav.Item>
                </>
              )}
              {/* <Nav.Item>
                <button
                  className="btn btn-secondary px-4 py-2"
                  onClick={showRegisterHandler}
                >
                  Register
                </button>
              </Nav.Item> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        show={auth.showLogin}
        onHide={closeLoginHandler}
        animation={true}
        centered
      >
        <Modal.Header className="border-0" closeButton />
        <Modal.Body className="pb-5 px-5">
          <div className="text-center">
            <h2 className="my-0">Log in</h2>
            <p className="text-dark">
              Login to your {company.companyName} account
            </p>
          </div>

          <LoginForm onSuccess={onLoginSuccessHandler} />
        </Modal.Body>
      </Modal>

      <Modal
        show={showRegister}
        onHide={closeRegisterHandler}
        animation={true}
        centered
        size="lg"
      >
        <Modal.Header className="border-0" closeButton />
        <Modal.Body className="pb-5 px-5">
          <div className="text-center">
            <h2 className="my-0">Register</h2>
            <p className="text-dark">
              Create your {company.companyName} account
            </p>
          </div>

          <RegisterForm registerHandler={loginHandler} />
        </Modal.Body>
      </Modal>
    </>
  );
}
