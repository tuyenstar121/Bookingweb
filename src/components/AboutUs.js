import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AboutUs = () => {
  return (

    <section>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="image">
            <img src="http://giadinh.mediacdn.vn/2019/8/27/photo-1-15668719453831804208086.jpg" alt="" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="content">
          <h1 className="text-4xl font-bold mb-4">
                <span className="text-green-500">about</span> us
              </h1>
            <h4 className="text-green-500">what makes our food special?</h4>
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
