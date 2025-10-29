
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-gray-900 to-slate-900 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
