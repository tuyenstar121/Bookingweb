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

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post('http://localhost:8080/auth/login', {
        username: email,
        password: password,
      });

      const userId = response.data; // Lấy user ID từ phản hồi của máy chủ

      Cookies.set('userId', userId, { expires: 7 }); // Lưu user ID vào cookie

      toast.success("Đăng nhập thành công");

      navigate('/Booking'); // Điều hướng đến trang đặt bàn sau khi đăng nhập thành công
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          toast.error('Sai tên đăng nhập hoặc mật khẩu');
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
          <h2>Sign In</h2>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <TextField
              type="text"
              className="input1"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
      <div className="input">
        <i className="fa-solid fa-lock"></i>
        <TextField
          type={showPassword ? "text" : "password"}
          className="input1"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <IconButton onClick={toggleShowPassword}>
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </div>
    </div>
          <div className="check">
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} />}
              label="Remember me"
            />
            <a href="forgetpass">Forgot Password?</a>
          </div>
          <div className="button">
            <Button variant="contained" className="btn" onClick={handleSubmit}>Sign In</Button>
          </div>
          <div className="sign-up">
            <p>Don't have an account?</p>
            <a href="register">Sign up</a>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
