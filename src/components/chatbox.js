import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'PasGo xin chào! PasGo là Mạng lưới hơn 3000 nhà hàng ngon, nổi tiếng tại Hà Nội, Sài Gòn, Đà Nẵng giúp Bạn đặt bàn dễ dàng, nhận kèm ưu đãi miễn phí!',
      time: '4 phút trước',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user', time: 'Vừa xong' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const response = await axios.get(`http://127.0.0.1:8000/predict/`, {
          params: {
            question: input,
          },
        });

        const botMessage = {
          sender: 'bot',
          text: response.data.predicted_answer,
          time: 'Vừa xong',
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error calling the API:', error);
        const errorMessage = {
          sender: 'bot',
          text: 'Xin lỗi, có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại sau.',
          time: 'Vừa xong',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="bg-gray-100 text-black p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chat ngay để được tư vấn</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div className="text-xs text-gray-500">
                  {msg.time}
                </div>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-500 text-white flex items-center'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <img
                      src="https://salt.tikicdn.com/ts/ta/7f/77/cf/a2b2c31ea7b0ad4b2e7d0e6ef817241b.png"
                      alt="bot-icon"
                      className="w-6 h-6 mr-2"
                    />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-300 flex items-center">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:border-green-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleSendMessage}
            >
              Gửi
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 py-2">
            PasGo.vn
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
