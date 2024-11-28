import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Payment = () => {
  // Sample data for the chart
  const transactionData = [
    { date: '01 Jul', amount: 100 },
    { date: '02 Jul', amount: 120 },
    { date: '03 Jul', amount: 90 },
    { date: '04 Jul', amount: 110 },
    { date: '05 Jul', amount: 85 },
    { date: '06 Jul', amount: 70 },
    { date: '07 Jul', amount: 95 },
  ];

  const receivableData = [
    { date: '01 Jul', amount: 40 },
    { date: '02 Jul', amount: 50 },
    { date: '03 Jul', amount: 45 },
    { date: '04 Jul', amount: 55 },
    { date: '05 Jul', amount: 60 },
    { date: '06 Jul', amount: 70 },
    { date: '07 Jul', amount: 80 },
  ];

  const payableData = [
    { date: '01 Jul', amount: 60 },
    { date: '02 Jul', amount: 50 },
    { date: '03 Jul', amount: 55 },
    { date: '04 Jul', amount: 45 },
    { date: '05 Jul', amount: 40 },
    { date: '06 Jul', amount: 35 },
    { date: '07 Jul', amount: 30 },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 text-gray-500">
        <span className="font-light">Home</span> <span className="font-bold">- Payment</span>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Overview */}
        <div className="bg-gray-100  p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Your Wallet</h3>
          <h2 className="text-4xl font-bold text-blue-500">$45000.00</h2>
          <p className="text-sm text-green-500 mt-2">This Month + $309</p>
          <div className="mt-6">
            <p className="text-sm font-semibold">$850 Expenses</p>
            <div className="h-1 w-full bg-purple-200 rounded mt-1">
              <div className="h-full w-1/2 bg-purple-500 rounded"></div>
            </div>
            <p className="text-sm font-semibold mt-2">125 Transactions</p>
            <div className="h-1 w-full bg-green-200 rounded mt-1">
              <div className="h-full w-3/4 bg-green-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Last Week Transaction Graph */}
        <div className="bg-gray-100  p-6 rounded-lg shadow-md col-span-2">
          <h3 className="text-lg font-semibold mb-4">Last Week Transaction</h3>
          {/* Graph for Last Week Transactions */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={transactionData}>
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats: Receivable, Payable, Wallet, Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Receivable */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Receivable</h4>
          {/* Graph for Receivable */}
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={receivableData}>
              <Line type="monotone" dataKey="amount" stroke="#e91e63" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Payable */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Payable</h4>
          {/* Graph for Payable */}
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={payableData}>
              <Line type="monotone" dataKey="amount" stroke="#ff9800" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Wallet */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Wallet</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-500">$5850</span>
            <p className="text-xs text-green-400">+25%</p>
          </div>
        </div>
        {/* Total Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Total Invoices</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-500">425</span>
            <p className="text-xs text-gray-400">Invoice Done</p>
          </div>
        </div>
      </div>

      {/* Previous Transactions Table */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4">Previous Transactions</h4>
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-gray-500">
              <th className="p-2">Brand</th>
              <th className="p-2">Date</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Purchase Date</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2 flex items-center">
                <img src="https://via.placeholder.com/30" alt="Pizza Hut" className="w-8 h-8 rounded-full mr-2" />
                Pizza Hut
              </td>
              <td className="p-2">20 Jun 2018</td>
              <td className="p-2">Pizza Hut</td>
              <td className="p-2">Tandoori Paneer Pizza - L</td>
              <td className="p-2">$485.00</td>
              <td className="p-2">
                <button className="text-blue-500">Details</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
