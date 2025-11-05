import React, { useState } from 'react';
import { ProfessionalAchievement } from '../../../types';
import { Button } from '../ui/Button';

interface AddAchievementModalProps {
  onClose: () => void;
  onSave: (newAchievement: Omit<ProfessionalAchievement, 'id'>) => void;
}

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({ onClose, onSave }) => {
  const [newAchievement, setNewAchievement] = useState<Omit<ProfessionalAchievement, 'id'>>({
    type: 'Work/Professional',
    role: '',
    organizationName: '',
    fromState: '',
    toState: '',
    description: '',
    rewards: [],
    isDesignation: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(newAchievement);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add Professional Achievement</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="role" className="block mb-1">Role</label>
            <input type="text" id="role" name="role" value={newAchievement.role} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div>
            <label htmlFor="organizationName" className="block mb-1">Organization</label>
            <input type="text" id="organizationName" name="organizationName" value={newAchievement.organizationName} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">Description</label>
            <textarea id="description" name="description" value={newAchievement.description} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default AddAchievementModal;
