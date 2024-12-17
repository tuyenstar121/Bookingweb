import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function Slideshow() {
  return (
    <Carousel interval={3000}>
      <Carousel.Item>
        <div className="relative">
          <img
     style={{ height: 600}}
            className="d-block w-full"
            src="https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="First slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl text-white font-bold">Chào mừng bạn đến với Nhà hàng</h3>
              <p className="mt-2  text-white">Nơi bạn sẽ được thưởng thức những món ăn tinh tế do đầu bếp tài hoa của chúng tôi chế biến, đảm bảo làm hài lòng mọi giác quan.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
                 style={{ height: 600}}
            className="d-block w-full"
            src="https://nhahangdimai.com/wp-content/uploads/2020/03/Banner__.jpg"
            alt="Second slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl  text-white font-bold">Khám phá hành trình ẩm thực tuyệt vời tại Nhà hàng của chúng tôi</h3>
              <p className="mt-2  text-white">Nơi sự sáng tạo trong từng món ăn và dịch vụ đẳng cấp quốc tế luôn chào đón bạn.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
                 style={{ height: 600}}
            className="d-block w-full"
            src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Third slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl  text-white font-bold">Đến với Nhà hàng của chúng tôi</h3>
              <p className="mt-2  text-white">Bạn sẽ được trải nghiệm không gian ấm cúng, thân thiện và thưởng thức những món ăn tuyệt hảo được chế biến từ nguyên liệu tươi ngon nhất.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slideshow;
