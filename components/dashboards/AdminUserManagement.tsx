
import { Card } from '../ui/Card';
import { usePrincipal } from '../../services/PrincipalProvider';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const AdminUserManagement = () => {
  const { availablePrincipals, principalsLoading, principalsError } = usePrincipal();

  const users = availablePrincipals.filter(p => p.type === 'INDIVIDUAL');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">User Management</h1>
      <Card className="!p-0">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">All Users</h2>
        </div>
        {principalsLoading && <p className="p-4 text-center text-gray-400">Loading users...</p>}
        {principalsError && <p className="p-4 text-center text-red-500">Error loading users: {principalsError.message}</p>}
        {!principalsLoading && !principalsError && users.length === 0 && (
          <p className="p-4 text-center text-gray-400">No users found.</p>
        )}
        {!principalsLoading && !principalsError && users.length > 0 && (
          <ul className="divide-y divide-slate-800">
            {users.map(user => (
              <li key={user.id}>
                <Link to={`/admin/principal/${user.id}`} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Icon name="user" className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{user.role}</div>
                  <Icon name="chevronRight" className="w-5 h-5 text-gray-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AdminUserManagement;
