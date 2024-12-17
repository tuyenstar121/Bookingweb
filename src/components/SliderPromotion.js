import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function SliderPromotion() {
  const [promotions, setPromotions] = useState()
  const fetchPromotions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/promotions/by-date?date=' + new Date().toISOString().split('T')[0]);
      setPromotions(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chương trình khuyến mãi:", error);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);
  console.log(promotions)
  return (
    <Carousel interval={3000} style={{ height: '' }}>
      {promotions?.map((item) => {
        return <Carousel.Item>
          <div className="relative">
            <img
              style={{ height: 450 }}
              className="d-block w-full"
              src={item.image}
              alt="First slide"
            />
          </div>
        </Carousel.Item>
      })}
    </Carousel>
  );
}

export default SliderPromotion;
