import React from 'react';

const ChangeProfilePhotoModal = ({ isOpen, onClose, handleProfileImageChange, previewImage, handleConfirmImageChange, isLoadingImage }) => {
    if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"> {/* Thay đổi kích thước modal */}
                <h2 className="text-center text-lg font-bold">Đổi ảnh đại diện</h2>
                <div className="flex flex-col items-center mt-4">
                    <button 
                        onClick={() => document.getElementById('profileImage').click()} 
                        className="font-bold py-3 text-blue-600 text-center cursor-pointer text-sm w-full"
                    >
                        Tải ảnh
                    </button>
                    <input 
                        type="file" 
                        onChange={handleProfileImageChange} 
                        id="profileImage" 
                        name="profileImage" 
                        style={{ display: 'none' }} // Ẩn input file
                    />
                    {previewImage && <img src={previewImage} alt="Preview" className="mt-3 w-32 h-32 object-cover" />} {/* Hiển thị ảnh xem trước */}
                </div>
                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="text-blue-500">
                        Hủy
                    </button>
                    <button disabled={isLoadingImage} onClick={handleConfirmImageChange} className={`${isLoadingImage?"bg-neutral-500":"bg-blue-500"} text-white py-2 px-4 rounded`}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeProfilePhotoModal;