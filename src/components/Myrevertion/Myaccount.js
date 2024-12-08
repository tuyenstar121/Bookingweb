import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock, FaHeart, FaCalendarAlt, FaLink, FaSignOutAlt } from 'react-icons/fa';
import './Myaccount.css';
import { useNavigate } from 'react-router-dom';
import PasswordManagementForm from '../password/password';
import ReservationHistory from '../Userprofile/ReservationHistory';
import Cookies from 'js-cookie';
import UserInfoForm from '../Userprofile/UserProfileForm';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useDisclosure } from '@chakra-ui/react';
import { uploadToCloudinary } from '../../config/UploadToCloudinary';
import ChangeProfilePhotoModal from './ChangeProfilePhotoModal';

const AccountDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('accountInfo');
  const [userData, setUserData] = useState(null);

  const [storedUserId, setStoredUserId] = useState(null);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [urlImage, setUrlImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const fetchUserData = async (userId) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setUrlImage(response.data?.img)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const handleUpdateUserData = async (updatedData) => {
    try {
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No JWT token found');
      }
      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data.user);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Lỗi cập nhật thông tin");
    }
  };

  const handleLogin = () => {
    if (loggedIn) {
      setLoggedIn(false);
      Cookies.remove('userId');
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setStoredUserId(userId);
      fetchUserData(userId);
    }
  }, []);

  const handleProfileImageChange = async (event) => {
    setIsLoadingImage(true)
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      const img = await uploadToCloudinary(selectedFile)
      setPreviewImage(img);
      setIsLoadingImage(false)
    }
  }
  const handleConfirmImageChange = async () => {
    const img = await uploadToCloudinary(previewImage);
    const data = {
      img: img
    }
    handleUpdateUserData(data)
    toast({
      title: "đã cập nhật ảnh đại diện",
      status: "success",
      duration: 5000,
      isClosable: true
    })
    onClose(); // Đóng modal sau khi xác nhận
    setUrlImage(img)
    setPreviewImage(null)
  }

  return (
    <>
      <Container className="container1">
        <Row>
          <Col md={3} className="border-end">
            <div className="text-center py-3">
              <div>
                <img className="image-placeholder object-cover" src={urlImage || userData?.img} alt="Avatar" />
                <p onClick={onOpen} className="font-bold text-blue-800 cursor-pointer">Đổi ảnh</p>
              </div>
              {/* <p>ID PasGo: {userData?.userId}</p> */}
              <p>SDT: {userData?.phone}</p>
            </div>
            <ListGroup variant="flush">
              <ListGroup.Item className='flex flex-row items-center py-3 ' action onClick={() => setActiveComponent('accountInfo')}>
                <FaUser className='mr-2' /> Thông tin tài khoản
              </ListGroup.Item>
              <ListGroup.Item className='flex flex-row items-center py-3 ' action onClick={() => setActiveComponent('passwordManager')}>
                <FaLock className='mr-2' /> Quản lý mật khẩu
              </ListGroup.Item>
              {/* <ListGroup.Item action onClick={() => setActiveComponent('wishlist')}>
              <FaHeart /> Danh sách yêu thích
            </ListGroup.Item> */}
              <ListGroup.Item className='flex flex-row items-center py-3' action onClick={() => setActiveComponent('reservationHistory')}>
                <FaCalendarAlt className='mr-2' /> Lịch sử đơn Đặt chỗ
              </ListGroup.Item>
              {/* <ListGroup.Item action onClick={() => setActiveComponent('accountLinking')}>
              <FaLink /> Liên kết tài khoản
            </ListGroup.Item> */}
              <ListGroup.Item className='flex flex-row items-center py-3 ' action onClick={handleLogin}>
                <FaSignOutAlt className='mr-2' /> Đăng xuất
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={9}>
            {activeComponent === 'passwordManager' && <PasswordManagementForm />}
            {activeComponent === 'reservationHistory' && <ReservationHistory userId={storedUserId} />}
            {activeComponent === 'accountInfo' && <UserInfoForm userData={userData} onUpdate={handleUpdateUserData} />}
          </Col>
        </Row>
      </Container>
      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        handleConfirmImageChange={handleConfirmImageChange}
        previewImage={previewImage}
        isLoadingImage={isLoadingImage}
      />
      <ToastContainer />
    </>
  );
};

export default AccountDashboard;