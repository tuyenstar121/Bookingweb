import React from 'react';
import '../style/Aboutus.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AboutUs = () => {
  return (

    <section>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="image">
            <img src="https://codingcirculate-restaurant-design.on.fleek.co/static/media/about-img.b50db0fa2bfd668b3a06" alt="" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="content">
            <h1 class="heading">
              <span>about</span> us
            </h1>
            <h3>what makes our food special?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus qui ea ullam, enim tempora ipsum
              fuga alias quae ratione a officiis id temporibus autem? Quod nemo facilis cupiditate. Ex, vel?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit amet enim quod veritatis, nihil voluptas
              culpa! Neque consectetur obcaecati sapiente?
            </p>
            <a href="#" class="btn">
              learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  );
};

export default AboutUs;
