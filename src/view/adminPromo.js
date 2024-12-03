import React from 'react';

import Sidebar from '../components/Sidebar/Sidebar';

import PromotionManagement from '../components/managerpromtionform';


const Adminpromotion = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
        <Sidebar />
        <PromotionManagement />

      </div>
    </div>
  );
};

export default Adminpromotion;
