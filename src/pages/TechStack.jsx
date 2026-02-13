import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const TechStack = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        icon: null,
    });
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchTechStack();
    }, []);

    const fetchTechStack = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/tech-stack');
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, icon: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('icon', formData.icon);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.post('http://localhost:5000/api/tech-stack', data, config);
            closeModal();
            fetchTechStack();
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.message || 'Error adding tech stack item';
            alert(`Failed: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tech-stack/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchTechStack();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleToggle = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/tech-stack/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTechStack();
        } catch (error) {
            console.error(error);
            alert('Error toggling status');
        }
    };

    const handleSeed = async () => {
        if (window.confirm('This will add default skills (React, Node, etc.) to the database if they don\'t exist. Continue?')) {
            try {
                await axios.post('http://localhost:5000/api/tech-stack/seed', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchTechStack();
                alert('Defaults loaded successfully!');
            } catch (error) {
                console.error(error);
                alert('Error seeding database');
            }
        }
    };

    const openModal = () => {
        setFormData({
            name: '',
            category: 'Frontend',
            icon: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="TechStack_container h-full">
            <div className="TechStack_header flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Tech Stack
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleSeed}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors border border-gray-700"
                    >
                        Load Defaults
                    </button>
                    <button
                        onClick={openModal}
                        className="TechStack_addButton flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaPlus /> Add Tech
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading tech stack...</div>
            ) : (
                <div className="TechStack_grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`TechStackCard_container border rounded-xl p-4 flex flex-col items-center gap-3 transition-colors relative group ${item.isEnabled ? 'bg-gray-900 border-gray-800' : 'bg-gray-900 border-red-900/50 opacity-75'}`}
                            >
                                <div className="w-16 h-16 flex items-center justify-center text-4xl text-gray-400">
                                    {item.iconType === 'icon' ? (
                                        <span>{item.icon}</span> // Just show name of icon for admin if it's an icon type
                                    ) : (
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-bold text-sm">{item.name}</h3>
                                    <p className="text-gray-500 text-xs">{item.category}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${item.isEnabled ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                        {item.isEnabled ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 p-1 rounded-lg backdrop-blur-sm">
                                    <button
                                        onClick={() => handleToggle(item._id)}
                                        className={`text-xs px-2 py-1 rounded ${item.isEnabled ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'}`}
                                        title={item.isEnabled ? "Disable" : "Enable"}
                                    >
                                        {item.isEnabled ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="text-red-500 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="TechStackForm_modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                                <h2 className="text-2xl font-bold text-white">Add Tech</h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tech Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required>
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="Database">Database</option>
                                        <option value="Tools">Tools</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Icon/Logo</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                                    <Button
                                        type="submit"
                                        loading={submitting}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechStack;
