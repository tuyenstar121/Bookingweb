import React from 'react';
import ReservationManagementTable from '../components/ReservationManagement';
import { useDisclosure } from '@chakra-ui/react';
import Header from '../components/Headerstaff';
import Footer from '../components/Footer';

const Adminorder = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6 bg-white shadow-md rounded-lg">
        <ReservationManagementTable />
      </main>
      <Footer />
    </div>
  );
};

export default Adminorder;
