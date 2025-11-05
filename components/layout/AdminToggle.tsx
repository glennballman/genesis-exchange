import { useAdminStore } from '../../services/adminStore';
import { Icon } from '../ui/Icon';

export const AdminToggle = () => {
  const { isAdminMode, toggleAdminMode } = useAdminStore();

  const handleToggle = () => {
    toggleAdminMode();
    if (isAdminMode) {
      window.location.href = '/';
    } else {
      window.location.href = '/#/admin';
    }
  };

  return (
    <div className="px-2 mt-4">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
      >
        <Icon name={isAdminMode ? 'shield-off' : 'shield-check'} className="mr-2" />
        {isAdminMode ? 'Exit Admin Mode' : 'Admin Mode'}
      </button>
    </div>
  );
};
