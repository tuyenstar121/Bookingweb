import React from 'react';

  
import Sidebar from '../components/Sidebar/Sidebar';

import TableManagement from '../components/TableManagement';


const Admintable = () => {
  return (
    <div className='admin'>
      <div className='admin-container'>
    <Sidebar/>
    <TableManagement/>
   
    </div>
    </div>
  );
};

export default Admintable;
