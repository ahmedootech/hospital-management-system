import Image from 'next/image';
import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useCompany } from '../hooks/useCompany';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const Home = () => {
  const company = useCompany();
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <Image
            src="/assets/images/image1.jpg"
            // layout="responsive"
            width={5000}
            height={500}
            alt="home image"
            className="d-block w-100"
            style={{ objectFit: 'cover' }}
          />
          <Carousel.Caption className="">
            <h2 className="display-3 fw-semibold">Transforming your care</h2>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <Image
            src="/assets/images/image2.jpg"
            // layout="responsive"
            width={5000}
            height={500}
            alt="home image"
            className="d-block w-100"
            style={{ objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h2 className="display-3 fw-semibold">
              We're here when you need us
            </h2>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src="/assets/images/image3.jpg"
            // layout="responsive"
            width={5000}
            height={500}
            alt="home image"
            className="d-block w-100"
            style={{ objectFit: 'cover' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <Image
            src="/assets/images/image4.jpg"
            // layout="responsive"
            width={5000}
            height={500}
            alt="home image"
            className="d-block w-100"
            style={{ objectFit: 'cover' }}
          />
        </Carousel.Item>
      </Carousel>
      <div className="bg-light py-5 my-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Our teams welcome the toughest cases
          </h1>
          <p className="fs-5">
            We tackle the most difficult challenges, not only to provide the
            best possible health outcomes for our patients but to push
            innovation further.
          </p>
        </div>
      </div>
      <div className="container my-5">
        <h3 className="display-5">Why Choose {company.companyName}? Clinic</h3>
        <div className="row">
          <div className="col-lg-4">
            <div className="d-flex flex-column border p-3 rounded h-100">
              <VolunteerActivismIcon
                fontSize="large"
                className="display-4 align-self-center text-success"
              />
              <h4 className="text-center">Patient Centered Care</h4>
              <p>
                We don’t just care for your health conditions. We care about
                you. That means our providers take the time to listen to what’s
                important to you before recommending next steps.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column border p-3 rounded h-100">
              <WorkspacesIcon
                fontSize="large"
                className="display-4 align-self-center text-danger"
              />
              <h4 className="text-center">Collaborative providers</h4>
              <p>
                You’ll get care from board-certified and fellowship trained
                experts who work together to create a treatment plan just for
                you. Only the highest standards ensure excellent outcomes.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column border p-3 rounded h-100">
              <TipsAndUpdatesIcon
                fontSize="large"
                className="display-4 align-self-center text-warning"
              />
              <h4 className="text-center">Innovation and research</h4>
              <p>
                We’re focused on today — and tomorrow. Our focus on research and
                offering the latest options means you can find a wide range of
                clinical trials and other care that you can’t find elsewhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
