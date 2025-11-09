
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { Principal } from '../types';
import { companyPrincipal, vcFundPrincipals } from '../data/principals';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../firebase';

interface PrincipalContextType {
  currentPrincipal: Principal | null;
  setCurrentPrincipal: (principal: Principal) => void;
  availablePrincipals: Principal[];
  principalsLoading: boolean;
  principalsError: Error | null;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export const PrincipalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPrincipal, setCurrentPrincipal] = useState<Principal | null>(companyPrincipal);
  const [individualPrincipals, setIndividualPrincipals] = useState<Principal[]>([]);
  const [principalsLoading, setPrincipalsLoading] = useState<boolean>(true);
  const [principalsError, setPrincipalsError] = useState<Error | null>(null);
  const db = getFirestore(app);

  useEffect(() => {
    setPrincipalsLoading(true);
    const principalsCollectionRef = collection(db, 'principals');
    const unsubscribeFromFirestore = onSnapshot(principalsCollectionRef, 
      (snapshot) => {
        const principals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'INDIVIDUAL',
        } as Principal));
        setIndividualPrincipals(principals);
        setPrincipalsLoading(false);
      },
      (error) => {
        console.error("Error fetching principals: ", error);
        setPrincipalsError(error);
        setPrincipalsLoading(false);
      }
    );
    
    return () => {
      unsubscribeFromFirestore();
    };
  }, [db]);

  const availablePrincipals = useMemo(() => {
    return [companyPrincipal, ...vcFundPrincipals, ...individualPrincipals];
  }, [individualPrincipals]);

  const value = useMemo(() => ({
    currentPrincipal,
    setCurrentPrincipal,
    availablePrincipals,
    principalsLoading,
    principalsError,
  }), [currentPrincipal, availablePrincipals, principalsLoading, principalsError]);

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
