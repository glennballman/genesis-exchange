
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Vault, VaultDocument } from '../../types';
import { vaultStore } from '../../services/vaultStore';

interface VaultCardProps {
  documents: VaultDocument[];
}

const mockVaults: Vault[] = [
    { id: 'legal', name: 'Legal', icon: 'legal', color: 'red' },
    { id: 'financials', name: 'Finance', icon: 'finance', color: 'green' },
    { id: 'team', name: 'HR', icon: 'hr', color: 'blue' },
    { id: 'ip', name: 'Product', icon: 'product', color: 'yellow' },
  ];

const VaultCard: React.FC<VaultCardProps> = ({ documents }) => {
    const [vaultState, setVaultState] = useState(vaultStore.getState());

    useEffect(() => {
        const unsubscribe = vaultStore.subscribe(() => {
            setVaultState(vaultStore.getState());
        });
        return unsubscribe;
    }, []);

  return (
    <Card className="lg:col-span-2">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Icon name="vault" className="w-6 h-6" />
        Individual Vault Contents
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockVaults.map(vault => {
          const vaultDocs = documents.filter(doc => doc.vaultId === vault.id);
          return (
            <div key={vault.id} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center bg-${vault.color}-500/10`}>
              <Icon name={vault.icon} className={`w-8 h-8 text-${vault.color}-400 mb-2`} />
              <p className="font-semibold text-white text-sm">{vault.name}</p>
              <p className="text-xs text-gray-400">{vaultDocs.length} items</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default VaultCard;
