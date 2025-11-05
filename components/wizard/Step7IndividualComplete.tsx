
import React from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

interface Step7IndividualCompleteProps {
    onClose: () => void;
    isEditing: boolean;
}

const Step7IndividualComplete: React.FC<Step7IndividualCompleteProps> = ({ onClose, isEditing }) => {
    return (
        <div className="text-center p-8">
            <Icon name="check-circle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
                {isEditing ? 'Profile Updated!' : 'Profile Created!'}
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                {isEditing
                    ? 'The profile has been successfully updated with your changes.'
                    : 'Thank you for providing your information. The profile has been successfully created.'}
            </p>
            <Button onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

export default Step7IndividualComplete;
