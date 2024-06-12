import React from 'react';
import MainDash from '../components/MainDash/MainDash';
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';
import ReservationManagementTable from '../components/ReservationManagement';

const Adminorder = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
       
        <Sidebar/>
        <ReservationManagementTable/>
      </div>
    </div>
  );
};

export default Adminorder;
