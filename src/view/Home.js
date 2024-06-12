import React from 'react';
import '../style/Boking.css'; 
import Slideshow from '../components/Slideshow';
import Booking from '../components/Booking';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutUs from '../components/AboutUs';
import  Card2 from '../components/Cards/Cardslist'

const Home = () => {
  return (
    <div className='wraper'>
      <Header />
      <div className='Slide-container'>
             
            <Slideshow />
         
    
        
      </div><div className="search-container">
          <Booking />
        </div>
        <div className='Restaurant-form'>
          <Card2></Card2>
        </div>
        <div className='Infor'>

         <AboutUs />
        </div>
      <Footer />
    </div>
  );
};

export default Home;
