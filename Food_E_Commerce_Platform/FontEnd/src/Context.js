import React, { createContext, useState, useContext } from "react";

const CustomerContext = createContext(null);

const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState({
    CustomerID: 2,
    FirstName: 'Jane',
    LastName: 'Smith',
    DateOfBirth: '1985-05-25 00:00:00',
    BankAccountNumber: '987654321',
    Email:'jane.smith@email.com',
    PhoneNumber: '0987654321',
    Gender: 0,
    Avatar:'https://res.cloudinary.com/div6eqrog/image/upload/v1738852801/download-removebg-preview_f8mfej.png',
    status: 'active'
  });
  const updateCustomer = (value)=>{
    setCustomer(value)
  }


  return (
    <CustomerContext.Provider value={{ customer, updateCustomer}}>
      {children}
    </CustomerContext.Provider>
  );
};

const useCustomer = () => {
  return useContext(CustomerContext);
};

export { CustomerProvider, useCustomer };
