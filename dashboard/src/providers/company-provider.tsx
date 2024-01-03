import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface companyProviderType {
  companyName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  phone: string;
  email: string;
  logoURL: string;
}
const defaultValues = {
  companyName: 'FMH',
  address: {
    street: 'No 38, Lamido Road, Nasarawa GRA',
    city: '',
    state: 'Kano State',
    postalCode: '',
    country: 'Nigeria',
  },
  phone: '09033221121',
  email: '',
  logoURL: '',
};

export const companyContext = createContext<companyProviderType>(defaultValues);

const CompanyProvider = ({ children }) => {
  const [companyProfile, setCompanyProfile] = useState(defaultValues);
  return (
    <companyContext.Provider value={{ ...companyProfile }}>
      {children}
    </companyContext.Provider>
  );
};

export default CompanyProvider;
