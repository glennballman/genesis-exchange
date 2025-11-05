
import React from 'react';
import { WizardFormData } from '../../types';

interface Step6IndividualReviewProps {
    prevStep: () => void;
    submit: () => void;
    data: WizardFormData;
}

const ReviewItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-semibold">{value || 'Not provided'}</p>
    </div>
);

const ReviewList: React.FC<{ label: string; items: { id: string; description: string }[] | undefined }> = ({ label, items }) => (
    <div className="py-2">
        <p className="text-sm text-gray-400">{label}</p>
        {items && items.length > 0 && items[0].description !== '' ? (
            <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                {items.map(item => (
                    <li key={item.id} className="text-white">{item.description}</li>
                ))}
            </ul>
        ) : (
            <p className="text-white font-semibold">Not provided</p>
        )}
    </div>
);

const Step6IndividualReview: React.FC<Step6IndividualReviewProps> = ({ prevStep, submit, data }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Review Your Information</h2>
            <div className="space-y-4 bg-slate-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2 mb-4">Core Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <ReviewItem label="Full Name" value={data.fullName} />
                    <ReviewItem label="Title" value={data.title} />
                    <ReviewItem label="Role" value={data.role} />
                    <ReviewItem label="LinkedIn URL" value={data.linkedinUrl} />
                </div>

                <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2 mb-4 mt-6">Details</h3>
                <ReviewList label="Achievements" items={data.achievements} />
                <ReviewList label="Goals" items={data.goals} />
                <ReviewList label="Interests" items={data.interests} />
            </div>

            <div className="flex justify-between pt-8">
                <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                <button type="button" onClick={submit} className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Submit & Finish</button>
            </div>
        </div>
    );
};

export default Step6IndividualReview;
