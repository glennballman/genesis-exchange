import React, { useState } from 'react';
import { User } from '../../../types';
import { Button } from '../ui/Button';

interface EditIndividualProfileModalProps {
  individual: User;
  onClose: () => void;
  onSave: (updatedIndividual: User) => void;
}

const EditIndividualProfileModal: React.FC<EditIndividualProfileModalProps> = ({ individual, onClose, onSave }) => {
  const [updatedIndividual, setUpdatedIndividual] = useState<User>(individual);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedIndividual(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedIndividual);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input type="text" id="name" name="name" value={updatedIndividual.name} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1">Role</label>
            <input type="text" id="role" name="role" value={updatedIndividual.role} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div>
            <label htmlFor="title" className="block mb-1">Title</label>
            <input type="text" id="title" name="title" value={updatedIndividual.title} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div>
            <label htmlFor="summary" className="block mb-1">Summary</label>
            <textarea id="summary" name="summary" value={updatedIndividual.summary} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" />
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

export default EditIndividualProfileModal;
