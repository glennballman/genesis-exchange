
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Principal } from '../types';
import { principals } from '../data/principals';

interface PrincipalContextType {
  currentPrincipal: Principal | null;
  setCurrentPrincipal: (principal: Principal) => void;
  availablePrincipals: Principal[];
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export const PrincipalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPrincipal, setCurrentPrincipal] = useState<Principal | null>(principals[0] || null);
  const availablePrincipals = principals;

  const value = {
    currentPrincipal,
    setCurrentPrincipal,
    availablePrincipals,
  };

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
