import React from 'react';
import MainDash from '../components/MainDash/MainDash';
  
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';
import FoodManagement from '../components/FoodManagement';


const AdminFood = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
    <Sidebar/>
    <FoodManagement/>
  
    </div>
    </div>
  );
};

export default AdminFood;
