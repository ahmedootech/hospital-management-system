import Image from 'next/image';
import { useCompany } from '../hooks/useCompany';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Logo = (props) => {
  const company = useCompany();
  return (
    <>
      {company.logoURL ? (
        <Image
          src="/images/logo.png"
          width={props.width || 99}
          height={props.height || 70}
          alt="Logo image"
        />
      ) : (
        <div className="d-flex align-items-center fs-2">
          <LocalHospitalIcon className="text-success" fontSize="45" />
          {company.companyName}
        </div>
      )}
    </>
  );
};
export default Logo;
