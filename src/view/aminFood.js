import React from 'react';
import MainDash from '../components/MainDash/MainDash';
  
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';
import DishManagement from '../components/DishManagement';


const AdminFood = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
    <Sidebar/>
    <DishManagement/>
  
    </div>
    </div>
  );
};

export default AdminFood;
