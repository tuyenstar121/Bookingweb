import React from 'react';
import '../style/Boking.css'; 

import Stafforder from '../components/stafforder';
import Header from '../components/Headerstaff';
import Footer from '../components/Footer';

  // const [loginError, setLoginError] = useState('');
const Booking1 = () => {
  return (
    <div>
      <Header />
      
      <div className='Slide-container'>
       
        <div className="search-container">
          <Stafforder />
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Booking1;
