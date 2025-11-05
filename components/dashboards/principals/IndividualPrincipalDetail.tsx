import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { users, updateUser, addAchievementToUser } from '../../../data/genesisData';
import { User, ProfessionalAchievement } from '../../../types';
import { Button } from '../../ui/Button';
import EditIndividualProfileModal from '../../modals/EditIndividualProfileModal';
import AddAchievementModal from '../../modals/AddAchievementModal';

const IndividualPrincipalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [individual, setIndividual] = useState<User | undefined>(users.find(u => u.id === id));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddAchievementModalOpen, setIsAddAchievementModalOpen] = useState(false);

  if (!individual) {
    return <div className="p-6 text-white">Individual not found</div>;
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = (updatedIndividual: User) => {
    updateUser(updatedIndividual);
    setIndividual(updatedIndividual);
  };

  const handleAddAchievement = () => {
    setIsAddAchievementModalOpen(true);
  };

  const handleCloseAddAchievementModal = () => {
    setIsAddAchievementModalOpen(false);
  };

  const handleSaveAchievement = (newAchievement: Omit<ProfessionalAchievement, 'id'>) => {
    if(individual) {
        addAchievementToUser(individual.id, newAchievement);
        setIndividual(users.find(u => u.id === id)); // re-fetch user to get updated achievements
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{individual.name}</h1>
        <div className="flex gap-4">
          <Button onClick={handleEditProfile} variant="outline">Edit Profile</Button>
          <Button onClick={handleAddAchievement}>Add Professional Achievement</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p><strong>Role:</strong> {individual.role}</p>
            <p><strong>Title:</strong> {individual.title}</p>
            <p><strong>Summary:</strong> {individual.summary}</p>
            <p><strong>Personal Mission:</strong> {individual.personalMission.statement}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            {individual.achievements.map(achievement => (
              <div key={achievement.id} className="mb-4">
                <p><strong>{achievement.role} at {achievement.organizationName}</strong></p>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditIndividualProfileModal
          individual={individual}
          onClose={handleCloseEditModal}
          onSave={handleSaveProfile}
        />
      )}

      {isAddAchievementModalOpen && (
        <AddAchievementModal
          onClose={handleCloseAddAchievementModal}
          onSave={handleSaveAchievement}
        />
      )}
    </div>
  );
};

export default IndividualPrincipalDetail;
