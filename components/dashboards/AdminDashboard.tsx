import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Administrator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Icon name="briefcase" className="mr-3" />
            Principals
          </h2>
          <p className="text-gray-400 mb-4">Manage organizations and individuals in the system.</p>
          <div className="flex flex-col space-y-2">
            <Link to="/admin/principals" className="text-blue-400 hover:underline">View All Principals</Link>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Icon name="users" className="mr-3" />
            User Management
          </h2>
          <p className="text-gray-400 mb-4">Add or remove administrators.</p>
          <div className="flex flex-col space-y-2">
            <Link to="/admin/users" className="text-blue-400 hover:underline">Manage Administrators</Link>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Icon name="zap" className="mr-3" />
            Workflows
          </h2>
          <p className="text-gray-400 mb-4">Start intake processes for new entities.</p>
          <div className="flex flex-col space-y-2">
            <Link to="/intake-wizard" className="text-blue-400 hover:underline">Start New Company Intake</Link>
            <Link to="/individual-intake-wizard" className="text-blue-400 hover:underline">Start New Individual Intake</Link>
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Icon name="map" className="mr-3" />
            Project Roadmap
          </h2>
          <p className="text-gray-400 mb-4">View the project roadmap and upcoming features.</p>
          <div className="flex flex-col space-y-2">
            <Link to="/admin/roadmap" className="text-blue-400 hover:underline">View Roadmap</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
