import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";

const ChangeProfilePhotoModal = ({isOpen, onClose, handleProfileImageChange}) => {
    return ( 
        <>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Modal Title</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col items-center">
                            <label htmlFor="profileImage" className="font-bold py-3 text-blue-600 text-center cursor-pointer text-xs w-full">
                                Tải ảnh
                            </label>
                            <input type="file" onChange={handleProfileImageChange} id="profileImage" name="profileImage"/>
                        </div>
                        <p className="py-3 text-center" onClick={onClose}>Hủy</p>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
     );
}
 
export default ChangeProfilePhotoModal;