import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Axios from 'axios';
import '../style/global.css';
import '../style/login.css';
import { ToastContainer, toast } from 'react-toastify'; // Import toast từ 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await Axios.post('http://localhost:8080/auth/forgot-password', {
        username: email,
      });

      toast.success("Một email đã được gửi đến bạn để đặt lại mật khẩu");

      navigate('/resetpass'); // Điều hướng đến trang đặt lại mật khẩu sau khi gửi yêu cầu thành công
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Email không tồn tại trong hệ thống');
        } else {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
      } else {
        toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
      }
    }
  };

  return (
    <div className="background">
      <ToastContainer />
      <section className="home">
        <div className="content">
          {/* <a href="#" className="logo">Nhà Hàng Của Tôi</a> */}
          <h2>Chào Mừng!</h2>
          <h3>Đến Với Nhà Hàng Của Chúng Tôi</h3>
          {/* <pre>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, asperiores</pre> */}
          <div className="icon">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>

        <div className="login">
          <h2>Quên Mật Khẩu</h2>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <TextField
              type="text"
              className="input1"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="button">
            <Button variant="contained" className="btn mt-2" onClick={handleSubmit}>Gửi</Button>
          </div>
          <div className="sign-up">
            <p>Bạn nhớ mật khẩu?</p>
            <a href="login">Đăng nhập</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordForm;
