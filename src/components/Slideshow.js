import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function Slideshow() {
  return (
    <Carousel interval={3000}>
      <Carousel.Item>
        <div className="relative">
          <img
            className="d-block w-full"
            src="https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="First slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl text-white font-bold">Nhà hàng A - Đẳng cấp ẩm thực</h3>
              <p className="mt-2  text-white">Mang đến cho bạn trải nghiệm ẩm thực tuyệt vời với các món ăn đa dạng từ các nền văn hóa khác nhau, kết hợp cùng không gian sang trọng và dịch vụ chuyên nghiệp.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
            className="d-block w-full"
            src="https://nhahangdimai.com/wp-content/uploads/2020/03/Banner__.jpg"
            alt="Second slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl  text-white font-bold">Nhà hàng B - Hương vị truyền thống</h3>
              <p className="mt-2  text-white">Với các món ăn đậm chất truyền thống và không gian ấm cúng, chúng tôi cam kết mang đến cho bạn những bữa ăn ngon miệng và những trải nghiệm đáng nhớ.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="relative">
          <img
            className="d-block w-full"
            src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Third slide"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="text-xl  text-white font-bold">Third slide label</h3>
              <p className="mt-2  text-white">Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slideshow;
