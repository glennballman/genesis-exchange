
import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';

const TeamPage: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newTitle, setNewTitle] = useState<string>('');

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [updatedName, setUpdatedName] = useState<string>('');
    const [updatedTitle, setUpdatedTitle] = useState<string>('');

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/team');
            if (!response.ok) throw new Error('Failed to fetch team members');
            const data = await response.json();
            setTeamMembers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, title: newTitle }),
            });
            if (!response.ok) throw new Error('Failed to add team member');
            const newMember = await response.json();
            setTeamMembers([...teamMembers, newMember]);
            setNewName('');
            setNewTitle('');
            setIsAddModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setUpdatedName(member.name);
        setUpdatedTitle(member.title);
        setIsEditModalOpen(true);
    };

    const handleUpdateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        try {
            const response = await fetch(`/api/team/${editingMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: updatedName, title: updatedTitle }),
            });

            if (!response.ok) throw new Error('Failed to update team member');
            
            const updatedMember = await response.json();
            setTeamMembers(teamMembers.map(m => m.id === updatedMember.id ? updatedMember : m));
            setIsEditModalOpen(false);
            setEditingMember(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            try {
                const response = await fetch(`/api/team/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete team member');

                setTeamMembers(teamMembers.filter(m => m.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Team Management</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">
                    Add Team Member
                </button>
            </div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Team Member</h2>
                        <form onSubmit={handleAddMember}>
                            {/* Form fields... */}
                            <div className="flex justify-end space-x-4">
                               <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                               <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">Add Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {isEditModalOpen && editingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Team Member</h2>
                        <form onSubmit={handleUpdateMember}>
                           <div className="mb-4">
                               <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                               <input type="text" id="name" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md" />
                           </div>
                           <div className="mb-4">
                               <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                               <input type="text" id="title" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md" />
                           </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                    <div key={member.id} className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between">
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <h2 className="text-xl font-semibold">{member.name}</h2>
                                <p className="text-gray-400">{member.title}</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => openEditModal(member)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
                            <button onClick={() => handleDeleteMember(member.id)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
