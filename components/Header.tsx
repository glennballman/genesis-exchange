
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { app } from '../firebase';

interface HeaderProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="lg:hidden">
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
            >
                <Icon name={isSidebarOpen ? 'close' : 'menu'} className="h-6 w-6" />
            </button>
        </div>
        <div className="hidden lg:block">
            {/* Breadcrumbs or page title could go here */}
        </div>
        <div>
            <button 
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
            >
                <Icon name="logout" className="h-6 w-6" />
            </button>
        </div>
    </header>
  );
};

export default Header;
