import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ReservationManagementTable from '../components/ReservationManagement';
import { useDisclosure } from '@chakra-ui/react';

const Adminorder = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <div className='admin'>
      <div className='admin-container'>
        <Sidebar />
        <ReservationManagementTable />
      </div>
    </div>
  );
};

export default Adminorder;
