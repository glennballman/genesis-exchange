import { Card } from '../../ui/Card';
import { users } from '../../../data/genesisData';
import { User } from '../../../types';
import { Link } from 'react-router-dom';

const IndividualsList = () => {
  const individuals: User[] = users;

  return (
    <Card>
      <ul>
        {individuals.map(individual => (
          <li key={individual.id} className="p-2 border-b border-gray-700">
            <Link to={`/admin/principal/${individual.id}`} className="text-cyan-400 hover:underline">
              {individual.name}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default IndividualsList;
