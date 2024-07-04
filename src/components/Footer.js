import React from 'react';

const Footer = () => {
  return (
    <div className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          {/* Logo Section */}
          <div className="w-full md:w-1/4 mb-6">
            <img src="http://jianghu.com.vn/wp-content/uploads/2020/11/logo_jiang-hu-04.png" alt="JiangHu Logo" className="mb-4" />
          </div>
          {/* Company Information */}
          <div className="w-full md:w-1/4 mb-6">
            <div className="text-xl font-bold mb-4">CÔNG TY TNHH NML TOÀN CẦU</div>
            <div className="mb-2 flex items-center">
              <span className="text-red-600 mr-2">
                <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              </span>
              770B - 770C Đường Sư Vạn Hạnh Nối Dài, P.12, Q.10, TP. Hồ Chí Minh
            </div>
            <div className="mb-2 flex items-center">
              <span className="text-red-600 mr-2">
                <i className="fas fa-phone-alt" aria-hidden="true"></i>
              </span>
              1900.232.326
            </div>
            <div className="mb-2 flex items-center">
              <span className="text-red-600 mr-2">
                <i className="fas fa-envelope" aria-hidden="true"></i>
              </span>
              info@jianghu.com.vn
            </div>
            <div className="mb-2">
              Số ĐKKD: 0108774136 . Ngày cấp: 20/10/2020
              <br />
              Địa chỉ: Tầng 3, nhà 175 Tô Hiệu, P Dịch Vọng, Q Cầu Giấy, Hà Nội/
            </div>
            <div className="mb-2">
              Nơi cấp: Sở kế hoạch và Đầu tư Thành phố Hồ Chí Minh
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/JiangHu-Heroes-Hotpot-102276578377666">
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="https://www.instagram.com/jianghu_heroes_hotpot/">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="https://zalo.me/1060890404192380192">
                <div className="icon-zalo"></div>
              </a>
              <a href="https://www.youtube.com/channel/UCPwHLZtmkHt_zaUn08Sarig">
                <i className="fab fa-youtube" aria-hidden="true"></i>
              </a>
              <a href="">
                <i className="fab fa-google-plus-g"></i>
              </a>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="">
                <div className="app-store"></div>
              </a>
              <a href="">
                <div className="google-play"></div>
              </a>
              <a href="http://online.gov.vn/Home/WebDetails/77520">
                <img className="ic_bct" src="https://jianghu.com.vn/wp-content/themes/jianghu/assets/images/Bộ công thương.png" alt="Bộ công thương" />
              </a>
            </div>
          </div>
          {/* About Us */}
          <div className="w-full md:w-1/4 mb-6">
            <div className="text-xl font-bold mb-4">VỀ CHÚNG TÔI</div>
            <ul className="space-y-2">
              <li>
                <a href="http://jianghu.com.vn/?page_id=93">Giới thiệu về JiangHu</a>
              </li>
              <li>
                <a href="http://jianghu.com.vn/">Nhượng quyền</a>
              </li>
              <li>
                <a href="http://jianghu.com.vn/?page_id=55">Tin tức và ưu đãi</a>
              </li>
              <li>
                <a href="http://jianghu.com.vn/?page_id=59">Cửa hàng</a>
              </li>
              <li>
                <a href="http://jianghu.com.vn/">Quy định chung</a>
              </li>
            </ul>
          </div>
          {/* Policies */}
          <div className="w-full md:w-1/4 mb-6">
            <div className="text-xl font-bold mb-4">CHÍNH SÁCH</div>
            <ul className="space-y-2">
              <li>
                <a href="http://jianghu.com.vn/?page_id=61">Chính sách thành viên</a>
              </li>
              <li>
                <a href="https://jianghu.com.vn/hinh-thuc-thanh-toan/">Hình thức thanh toán</a>
              </li>
              <li>
                <a href="https://jianghu.com.vn/chinh-sach-giao-hang/">Vận chuyển giao nhận</a>
              </li>
              <li>
                <a href="https://jianghu.com.vn/chinh-sach-doi-tra/">Đổi trả hàng và hoàn tiền</a>
              </li>
              <li>
                <a href="https://jianghu.com.vn/chinh-sach-bao-mat-thong-tin/">Bảo vệ thông tin cá nhân</a>
              </li>
              <li>
                <a href="http://jianghu.com.vn/">Bảo hành, bảo trì</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm">
          <div className="flex justify-between">
            <div>JiangHu Hotpot</div>
            <div>Copyrights © 2019 by JiangHuHotpot. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
