import React from 'react';
import '../style/Boking.css'; 
import Myboking from '../components/Myrevertion/Myaccount';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Mybooking = () => {
  return (
    <div className='wraper'>
      <Header />
    <Myboking/>
      <Footer />
    </div>
  );
};

export default Mybooking;
