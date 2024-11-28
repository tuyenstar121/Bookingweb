import React from 'react';
import MainDash from '../components/MainDash/MainDash';
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';

import Navbar from '../components/navbar/NavbarAdmin';
import { useDisclosure } from '@chakra-ui/react';

const Admin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fixed = false; // Example value, update as necessary
  const rest = {}; // Example value, update as necessary


  return (
    <div className='admin'>

      <div className='admin-container'>
        <Sidebar />

        <div className='admin-main'>

          <Navbar
            onOpen={onOpen}
            logoText={'Horizon UI Dashboard PRO'}
            brandText={'Main Dashboard'}
            secondary={'/admin'}
            fixed={fixed}
            {...rest}
          />
          <div className="mt-20">
            {/* <MainDash /> */}
            <RigtSide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
