import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

const AdminWorkflows = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Workflows</h1>
      <Card>
        <h2 className="text-xl font-bold mb-4 text-white">Intake Workflows</h2>
        <p className="text-gray-400 mb-6">Start intake processes for new entities.</p>
        <div className="flex flex-col space-y-2">
          <Link to="/intake-wizard" className="text-blue-400 hover:underline">Start New Company Intake</Link>
          <Link to="/individual-intake-wizard" className="text-blue-400 hover:underline">Start New Individual Intake</Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminWorkflows;
