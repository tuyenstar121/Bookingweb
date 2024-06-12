import React from 'react';
import MainDash from '../components/MainDash/MainDash';
  
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';
import RestaurantManagement from '../components/RestaurantManagementTable';


const Adminre = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
    <Sidebar/>
    <RestaurantManagement/>
   
    </div>
    </div>
  );
};

export default Adminre;
