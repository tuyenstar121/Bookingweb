
// src/utils/imageUploader.js
import axios from 'axios';

export const uploadImage = async (file) => {
  const apiKey = 'c6e43f08e521cd9571eabad1b4c153b0';
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
    return response.data.data.url; // Trả về URL hình ảnh
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error);
    throw error;
  }
};
