import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Axios from 'axios';
import '../style/global.css';
import '../style/login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 phút
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await Axios.post('http://localhost:8080/auth/reset-password', {
        username: username,
        otp: otp,
        newPassword: newPassword,
      });

      toast.success("Mật khẩu của bạn đã được đặt lại thành công");

      navigate('/login');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="background">
      <ToastContainer />
      <section className="home">
        <div className="content">
          <a href="#" className="logo">Nhà Hàng Của Tôi</a>
          <h2>Chào Mừng!</h2>
          <h3>Đến Với Nhà Hàng Của Chúng Tôi</h3>
          <pre>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, asperiores</pre>
          <div className="icon">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>

        <div className="login">
          <h2>Đặt Lại Mật Khẩu</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-user"></i>
              <TextField
                type="text"
                className="flex-1 bg-white rounded"
                placeholder="Tên người dùng"
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-key"></i>
              <TextField
                type="text"
                className="flex-1 bg-white rounded"
                placeholder="Mã OTP"
                value={otp}
                onChange={handleOtpChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-lock"></i>
              <TextField
                type={showPassword ? "text" : "password"}
                className="flex-1 bg-white rounded"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Hiển thị mật khẩu"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="contained" className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={handleSubmit}>Gửi</Button>
            </div>
            <div className="text-center mt-2 text-red-500">
              Thời gian còn lại: {formattedTime()}
            </div>
          </div>

          <div className="sign-up">
            <p>Bạn nhớ mật khẩu?</p>
            <a href="login">Đăng nhập</a>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
