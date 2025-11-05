
import React from 'react';
import { Icon } from '../ui/Icon';

interface DynamicListInputProps {
    items: { id: string; description: string }[];
    setItems: (items: { id: string; description: string }[]) => void;
    placeholder: string;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({ items, setItems, placeholder }) => {

    const handleItemChange = (id: string, description: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, description } : item);
        setItems(newItems);
    };

    const addItem = () => {
        const newItem = { id: Date.now().toString(), description: '' };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                        placeholder={`${placeholder} #${index + 1}`}
                        className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-slate-700 transition-colors"
                        aria-label="Remove item"
                    >
                        <Icon name="trash" className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-400 hover:text-white hover:bg-cyan-600/20 rounded-md transition-colors"
            >
                <Icon name="plus-circle" className="w-5 h-5" />
                Add Another
            </button>
        </div>
    );
};

export default DynamicListInput;
