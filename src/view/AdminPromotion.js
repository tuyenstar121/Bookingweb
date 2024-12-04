import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import PromotionManager from '../components/PromotionManagement';

function AdminPromotion(props) {
  return (
    <div className='admin'>
      <div className='admin-container'>
        <Sidebar />
        <PromotionManager />

      </div>
    </div>
  );
}

export default AdminPromotion;