
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePrincipal } from '../../../services/PrincipalProvider';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';

const IndividualsList: React.FC = () => {
    const { availablePrincipals } = usePrincipal();
    const location = useLocation();
    const isAdminMode = location.pathname.startsWith('/admin');

    const individuals = availablePrincipals.filter(p => p.type === 'INDIVIDUAL');

    if (!individuals.length) {
        return (
            <Card>
                <p className="text-center text-gray-400">No individual principals found.</p>
            </Card>
        );
    }

    return (
        <Card className="!p-0">
            <div className="p-4 border-b border-slate-700">
                 <h2 className="text-lg font-semibold text-white">Individual Principals</h2>
            </div>
            <ul className="divide-y divide-slate-800">
                {individuals.map(principal => {
                    const linkPath = isAdminMode
                        ? `/admin/principal/${principal.id}`
                        : `/discovery/principal/${principal.id}`;
                    
                    return (
                        <li key={principal.id}>
                            <Link to={linkPath} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <Icon name="user" className="w-6 h-6 text-gray-400"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{principal.name}</p>
                                        <p className="text-sm text-gray-400">{principal.title}</p>
                                    </div>
                                </div>
                                <Icon name="chevronRight" className="w-5 h-5 text-gray-500" />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
};

export default IndividualsList;
