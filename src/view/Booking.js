import React from 'react';
import '../style/Boking.css'; 
import Slideshow from '../components/Slideshow';
import Booking from '../components/Booking';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutUs from '../components/AboutUs';
  // const [loginError, setLoginError] = useState('');
const Booking1 = () => {
  return (
    <div>
      <Header />
      
      <div className='Slide-container'>
       
        <div className="search-container">
          <Booking />
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Booking1;
