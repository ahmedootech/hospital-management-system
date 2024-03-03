import { useCompany } from '../hooks/useCompany';

const Footer = () => {
  const company = useCompany();
  return (
    <footer>
      <div className="container-fluid px-5 pb-2"></div>
    </footer>
  );
};

export default Footer;
