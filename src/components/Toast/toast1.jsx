import React from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

const CustomToast = ({ headerText, timeAgo, toastMessage, position }) => {
  return (
    <ToastContainer className="p-3" position={position} style={{ zIndex: 1 }}>
      <Toast>
        <Toast.Header closeButton={false}>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">{headerText}</strong>
          <small>{timeAgo}</small>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast; // Exporting the component as default

