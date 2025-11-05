import { Card } from '../ui/Card';
import { companyPrincipal, vcFundPrincipals } from '../../data/principals';
import { Principal } from '../../types';
import IndividualsList from './principals/IndividualsList';

const AdminPrincipals = () => {
  const principals: Principal[] = [companyPrincipal, ...vcFundPrincipals];
  const organizations = principals.filter(p => p.type === 'COMPANY' || p.type === 'VC_FUND');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Manage Principals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Organizations</h2>
          <Card>
            <ul>
              {organizations.map(org => (
                <li key={org.id} className="p-2 border-b border-gray-700">{org.name}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Individuals</h2>
          <IndividualsList />
        </div>
      </div>
    </div>
  );
};

export default AdminPrincipals;
