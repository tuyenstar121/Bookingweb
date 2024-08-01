import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Axios from 'axios';
import '../style/global.css';
import '../style/login.css';
import { ToastContainer, toast } from 'react-toastify'; // Import toast from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

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

      navigate('/resetpass'); // Điều hướng về trang chủ sau khi yêu cầu đặt lại mật khẩu thành công
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
          <a href="#" className="logo">MyRestaurant</a>
          <h2>Welcome!</h2>
          <h3>To Our Myrestaurants</h3>
          <pre>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, asperiores</pre>
          <div className="icon">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>

        <div className="login">
          <h2>Forgot Password</h2>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <TextField
              type="text"
              className="input1"
              placeholder="username"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="button">
            <Button variant="contained" className="btn" onClick={handleSubmit}>Submit</Button>
          </div>
          <div className="sign-up">
            <p>Remember your password?</p>
            <a href="login">Sign in</a>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
