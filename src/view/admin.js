import React from 'react';
import MainDash from '../components/MainDash/MainDash';
  
import Sidebar from '../components/Sidebar/Sidebar';
import RigtSide from '../components/RigtSide/RightSide';


const Admin = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
    <Sidebar/>
    <div className='admin-main'>
    <MainDash/>
    <RigtSide/>
    </div>
    </div>
    </div>
  );
};

export default Admin;
