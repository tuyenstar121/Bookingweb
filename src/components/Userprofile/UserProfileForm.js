import React ,{useEffect,useState}from 'react';

const UserInfoForm = ({ userData, onUpdate }) => {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [dayOfBirth, setDayOfBirth] = useState(userData?.dayOfBirth || '');
  const [monthOfBirth, setMonthOfBirth] = useState(userData?.monthOfBirth || '');
  const [yearOfBirth, setYearOfBirth] = useState(userData?.yearOfBirth || '');
  const [gender, setGender] = useState(userData?.gender || 'Nam');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { name, email, dayOfBirth, monthOfBirth, yearOfBirth, gender };
    onUpdate(updatedData);
  };

  useEffect(() => {
    if (userData) {
      setName(userData.username);
      setEmail(userData.email);
      setDayOfBirth(userData.dayOfBirth);
      setMonthOfBirth(userData.monthOfBirth);
      setYearOfBirth(userData.yearOfBirth);
      setGender(userData.gender);
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">THÔNG TIN TÀI KHOẢN</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
        />
      </div>
      <div className="mb-4 flex space-x-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày sinh:</label>
          <input
            type="text"
            value={dayOfBirth}
            onChange={(e) => setDayOfBirth(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tháng:</label>
          <input
            type="text"
            value={monthOfBirth}
            onChange={(e) => setMonthOfBirth(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Năm:</label>
          <input
            type="text"
            value={yearOfBirth}
            onChange={(e) => setYearOfBirth(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Giới tính:</label>
        <div className="mt-1 flex items-center">
          <label className="mr-4">
            <input
              type="radio"
              value="Nam"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
              className="form-radio h-4 w-4 text-yellow-600"
            />
            <span className="ml-2">Nam</span>
          </label>
          <label>
            <input
              type="radio"
              value="Nữ"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
              className="form-radio h-4 w-4 text-yellow-600"
            />
            <span className="ml-2">Nữ</span>
          </label>
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;
