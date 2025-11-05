
import React from 'react';
import { Icon } from '../ui/Icon';
import { Link } from 'react-router-dom';

const Step7IndividualComplete: React.FC = () => {
    return (
        <div className="text-center">
            <Icon name="check-circle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Profile Created!</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                Thank you for providing your information. Your profile has been successfully created.
            </p>
            <Link to="/admin/principals" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Return to Manage Principals
            </Link>
        </div>
    );
};

export default Step7IndividualComplete;
