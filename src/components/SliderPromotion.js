import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function SliderPromotion() {
  return (
    <Carousel interval={3000} style={{ height: 'auto' }}>
      <Carousel.Item>
        <div className="relative">
          <img
            style={{ height: 300 }}
            className="d-block w-full"
            src="https://blog.dktcdn.net/files/khuyen-mai-nha-hang.jpg"
            alt="First slide"
          />
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
            style={{ height: 300 }}
            className="d-block w-full"
            src="https://vill.vn/wp-content/uploads/2023/11/3-WEB-BANNER-MUC-KHUYEN-MAI-1024x410.png"
            alt="Second slide"
          />
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
            style={{ height: 300 }}
            className="d-block w-full"
            src="https://inan2h.vn/wp-content/uploads/2022/12/dai-dien-9.jpg"
            alt="Third slide"
          />
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default SliderPromotion;
