import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useAdminStore } from '../../services/adminStore';
import { AdminToggle } from './AdminToggle';

const navigationLinks = [
  { name: 'Command Center', href: '/', icon: 'logo' as const },
  { name: 'Genesis Score', href: '/genesis-score', icon: 'score-details' as const },
  { name: 'Score Calculation', href: '/score-calculation', icon: 'calculation' as const },
  { name: 'Team', href: '/team', icon: 'team' as const },
  { name: 'CTO HUD', href: '/cto', icon: 'cto' as const },
  { name: 'CFO HUD', href: '/cfo', icon: 'cfo' as const },
  { name: 'CMO HUD', href: '/cmo', icon: 'cmo' as const },
];

const adminNavigationLinks = [
    { name: 'Admin Dashboard', href: '/admin', icon: 'shield-check' as const },
    { name: 'Principals', href: '/admin/principals', icon: 'briefcase' as const },
    { name: 'Users', href: '/admin/users', icon: 'users' as const },
    { name: 'Workflows', href: '/admin/workflows', icon: 'workflow' as const },
];

const toolsLinks = [
    { name: 'Discovery', href: '/discovery', icon: 'discovery' as const },
    { name: 'Alignment', href: '/alignment', icon: 'horizon' as const },
    { name: 'DD Vaults', href: '/vaults', icon: 'vaults' as const },
    { name: 'Action Plan', href: '/action-plan', icon: 'action-plan' as const },
    { name: 'Diligence Hub', href: '/due-diligence', icon: 'diligence' as const },
    { name: 'Documentation', href: '/documentation', icon: 'documentation' as const },
    { name: 'Roadmap', href: '/roadmap', icon: 'roadmap' as const },
    { name: 'Intake Wizard', href: '/intake-wizard', icon: 'wizard' as const },
    { name: 'Saved Insights', href: '/saved-insights', icon: 'saved' as const },
];

const Sidebar: React.FC = () => {
  const { isAdminMode } = useAdminStore();
  const activeLinkClass = 'bg-cyan-500/10 text-cyan-300';
  const inactiveLinkClass = 'text-gray-400 hover:bg-gray-700/50 hover:text-white';

  const renderLinks = (links: typeof navigationLinks) => {
      return links.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <Icon name={item.icon} className="mr-3 h-6 w-6" />
            {item.name}
          </NavLink>
      ));
  }

  return (
    <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <div className="flex items-center space-x-2">
            <Icon name="logo" className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">Genesis</span>
        </div>
      </div>
      
      <AdminToggle />

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {isAdminMode ? (
            <>
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Menu</p>
                {renderLinks(adminNavigationLinks)}
            </>
        ) : (
            <>
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboards</p>
                {renderLinks(navigationLinks)}

                <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</p>
                {renderLinks(toolsLinks)}
            </>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${
                isActive ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`
            }
        >
            <img src="https://i.pravatar.cc/40?u=tony-stark" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-600" />
            <div>
                <p className="text-sm font-semibold text-white">Tony Stark</p>
                <p className="text-xs text-gray-400">My Genesis U</p>
            </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
