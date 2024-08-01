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
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
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
          <h2>Reset Password</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-user"></i>
              <TextField
                type="text"
                className="flex-1 bg-white rounded"
                placeholder="Username"
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-key"></i>
              <TextField
                type="text"
                className="flex-1 bg-white rounded"
                placeholder="OTP"
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
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
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
              <Button variant="contained" className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={handleSubmit}>Submit</Button>
            </div>
            <div className="text-center mt-2 text-red-500">
              Time remaining: {formattedTime()}
            </div>
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

export default ResetPasswordForm;
