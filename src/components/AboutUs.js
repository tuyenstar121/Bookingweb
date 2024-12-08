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
          <div class="content w-auto">
            <h1 className="text-4xl font-bold mb-4">
              <span>Về chúng tôi</span>
            </h1>
            <h4 className="text-green-500">Không gian tại nhà hàng của bạn như thế nào?</h4>
            <p>
              Nhà hàng của chúng tôi được thiết kế với không gian ấm cúng, 
              thân thiện nhưng không kém phần sang trọng.
            </p>
            <p>
              Chúng tôi có cả không gian trong nhà và ngoài trời, phù hợp cho cả những bữa tiệc gia đình ấm cúng lẫn những buổi họp mặt bạn bè sôi động.
            </p>
            <h4 className="text-green-500">Nhà hàng của bạn có cung cấp dịch vụ đặt bàn trước không?</h4>
            <p>
              Có, chúng tôi luôn sẵn sàng phục vụ bạn với dịch vụ đặt bàn trước tiện lợi.
            </p>
            <p>
            Bạn có thể đặt bàn qua website của chúng tôi để đảm bảo có chỗ ngồi ưa thích vào những thời điểm cao điểm.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  );
};

export default AboutUs;
