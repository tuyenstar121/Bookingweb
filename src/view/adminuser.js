import React from 'react';
import UserManagementTable from '../components/usermng';
  
import Sidebar from '../components/Sidebar/Sidebar';



const Adminu = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
     <Sidebar/>
     <UserManagementTable/>
    
    </div>
    </div>
  );
};

export default Adminu;
