import React, { useState, useEffect } from 'react';
// Import file CSS cho Slideshow
import Carousel from 'react-bootstrap/Carousel';
function Slideshow  () {
  return (
    <Carousel  interval={3000} >
      <Carousel.Item>
        <img
                className="d-block w-100 "
          src="https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3 className='text-white '>Nhà hàng A - Đẳng cấp ẩm thực</h3>
          <p className='text-white'>Mang đến cho bạn trải nghiệm ẩm thực tuyệt vời với các món ăn đa dạng từ các nền văn hóa khác nhau, kết hợp cùng không gian sang trọng và dịch vụ chuyên nghiệp.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://nhahangdimai.com/wp-content/uploads/2020/03/Banner__.jpg"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3 className='text-white '>Nhà hàng B - Hương vị truyền thống</h3>
          <p className='text-white '>"Với các món ăn đậm chất truyền thống và không gian ấm cúng, chúng tôi cam kết mang đến cho bạn những bữa ăn ngon miệng và những trải nghiệm đáng nhớ.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
         className="d-block w-100"
          src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slideshow;
