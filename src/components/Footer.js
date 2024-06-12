import React from 'react';
import '../style/Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content d-flex container">
        <div className="footer-section one">
          <img src="http://jianghu.com.vn/wp-content/uploads/2020/11/logo_jiang-hu-04.png" alt="JiangHu Logo" />
        </div>
        <div className="footer-section two">
          <div className="footer-title">CÔNG TY TNHH NML TOÀN CẦU</div>
          <div className="footer-line d-flex">
            <span className="wrap-icon" style={{ color: '#db0a25' }}>
              <i className="fas fa-map-marker" aria-hidden="true"></i>
            </span>
            <div>770B - 770C Đường Sư Vạn Hạnh Nối Dài, P.12, Q.10, TP. Hồ Chí Minh</div>
          </div>
          <div className="footer-line d-flex">
            <span className="wrap-icon" style={{ color: '#db0a25' }}>
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
            </span>
            <div>1900.232.326</div>
          </div>
          <div className="footer-line d-flex">
            <span className="wrap-icon" style={{ color: '#db0a25' }}>
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </span>
            <div>info@jianghu.com.vn</div>
          </div>
          <div className="footer-line">
            Số ĐKKD: 0108774136 . Ngày cấp: 20/10/2020
            <br />
            Địa chỉ: Tầng 3, nhà 175 Tô Hiệu, P Dịch Vọng, Q Cầu Giấy, Hà Nội/
          </div>
          <div className="footer-line">Nơi cấp: Sở kế hoạch và Đầu tư Thành phố Hồ Chí Minh</div>
          <div className="footer-line social">
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
          <div className="footer-line images">
            <a href="">
              <div className="app-store"></div>
            </a>
            <a href="">
              <div className="google-play"></div>
            </a>
            <a href="http://online.gov.vn/Home/WebDetails/77520">
              <img className="ic_bct" src="https://jianghu.com.vn/wp-content/themes/jianghu/assets/images/Bộ công thương.png" alt="" />
            </a>
          </div>
        </div>
        <div className="footer-section three">
          <div className="footer-title">VỀ CHÚNG TÔI</div>
          <div className="menu-footer_about_us">
            <ul id="menu-footer-abouts-us" className="menu">
              <li id="menu-item-181" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-181">
                <a href="http://jianghu.com.vn/?page_id=93">Giới thiệu về JiangHu</a>
              </li>
              <li id="menu-item-182" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-182">
                <a href="http://jianghu.com.vn/">Nhượng quyền</a>
              </li>
              <li id="menu-item-183" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-183">
                <a href="http://jianghu.com.vn/?page_id=55">Tin tức và ưu đãi</a>
              </li>
              <li id="menu-item-184" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-184">
                <a href="http://jianghu.com.vn/?page_id=59">Cửa hàng</a>
              </li>
              <li id="menu-item-185" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-185">
                <a href="http://jianghu.com.vn/">Quy định chung</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-section four">
          <div className="footer-title">CHÍNH SÁCH</div>
          <div className="menu-footer_policy">
            <ul id="menu-footer-policy" className="menu">
              <li id="menu-item-187" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-187">
                <a href="http://jianghu.com.vn/?page_id=61">Chính sách thành viên</a>
              </li>
              <li id="menu-item-188" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-188">
                <a href="https://jianghu.com.vn/hinh-thuc-thanh-toan/">Hình thức thanh toán</a>
              </li>
              <li id="menu-item-189" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-189">
                <a href="https://jianghu.com.vn/chinh-sach-giao-hang/">Vận chuyển giao nhận</a>
              </li>
              <li id="menu-item-190" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-190">
                <a href="https://jianghu.com.vn/chinh-sach-doi-tra/">Đổi trả hàng và hoàn tiền</a>
              </li>
              <li id="menu-item-191" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-191">
                <a href="https://jianghu.com.vn/chinh-sach-bao-mat-thong-tin/">Bảo vệ thông tin cá nhân</a>
</li>
              <li id="menu-item-192" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-192">
                <a href="http://jianghu.com.vn/">Bảo hành, bảo trì</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <div className="left">JiangHu Hotpot</div>
        <div className="right">Copyrights © 2019 by JiangHuHotpot. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
