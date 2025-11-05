
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { Principal } from '../types';
import { companyPrincipal, vcFundPrincipals } from '../data/principals';
import { teamStore } from './teamStore';

interface PrincipalContextType {
  currentPrincipal: Principal | null;
  setCurrentPrincipal: (principal: Principal) => void;
  availablePrincipals: Principal[];
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export const PrincipalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPrincipal, setCurrentPrincipal] = useState<Principal | null>(companyPrincipal);
  const [users, setUsers] = useState(teamStore.getTeam());

  useEffect(() => {
    const handleTeamUpdate = () => {
      setUsers(teamStore.getTeam());
    };
    
    const unsubscribe = teamStore.subscribe(handleTeamUpdate);
    
    return () => unsubscribe();
  }, []);

  const availablePrincipals = useMemo(() => {
    const individualPrincipals = users.map(u => ({ ...u, type: 'INDIVIDUAL' } as Principal));
    return [companyPrincipal, ...vcFundPrincipals, ...individualPrincipals];
  }, [users]);

  const value = useMemo(() => ({
    currentPrincipal,
    setCurrentPrincipal,
    availablePrincipals,
  }), [currentPrincipal, availablePrincipals]);

  return (
    <PrincipalContext.Provider value={value}>
      {children}
    </PrincipalContext.Provider>
  );
};

export const usePrincipal = () => {
  const context = useContext(PrincipalContext);
  if (context === undefined) {
    throw new Error('usePrincipal must be used within a PrincipalProvider');
  }
  return context;
};
