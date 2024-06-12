import React, { useState, useEffect } from 'react';
// Import file CSS cho Slideshow
import Carousel from 'react-bootstrap/Carousel';
function Slideshow  () {
  return (
    <Carousel  interval={3000} >
      <Carousel.Item>
        <img
                className="d-block w-100 "
          src="https://th.bing.com/th/id/OIG1.RuLcpBx6P0QR23J8HgNl?pid=ImgGn"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://th.bing.com/th/id/OIG1.9rkNcxmeSGsXvy5vyuok?w=1024&h=1024&rs=1&pid=ImgDetMain"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
         className="d-block w-100"
          src="https://th.bing.com/th/id/OIG1.oOh9_x95wC9RQDOSIz_q?pid=ImgGn"
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
