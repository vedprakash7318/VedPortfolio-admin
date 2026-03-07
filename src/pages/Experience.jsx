import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrash, FaTimes, FaBriefcase, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null); // ID of passing to edit
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        duration: '',
        year: '',
        description: '',
    });
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchExperience();
    }, []);

    const fetchExperience = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/experience');
            setExperiences(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (editId) {
                // Update existing
                await axios.put(`http://localhost:5000/api/experience/${editId}`, formData, config);
            } else {
                // Create new
                await axios.post('http://localhost:5000/api/experience', formData, config);
            }
            closeModal();
            fetchExperience();
        } catch (error) {
            console.error(error);
            alert('Error saving experience');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await axios.delete(`http://localhost:5000/api/experience/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchExperience();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (exp) => {
        setFormData({
            jobTitle: exp.jobTitle,
            company: exp.company,
            duration: exp.duration,
            year: exp.year,
            description: exp.description,
        });
        setEditId(exp._id);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setFormData({
            jobTitle: '',
            company: '',
            duration: '',
            year: '',
            description: '',
        });
        setEditId(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
            jobTitle: '',
            company: '',
            duration: '',
            year: '',
            description: '',
        });
    };

    return (
        <div className="Experience_container h-full">
            <div className="Experience_header flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Experience
                </h1>
                <button
                    onClick={openModal}
                    className="Experience_addButton flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <FaPlus /> Add Experience
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading experience...</div>
            ) : (
                <div className="Experience_list space-y-4">
                    <AnimatePresence>
                        {experiences.map((exp) => (
                            <motion.div
                                key={exp._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="ExperienceCard_container bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors flex gap-6"
                            >
                                <div className="hidden md:flex flex-col items-center justify-center w-24 border-r border-gray-800 pr-6">
                                    <span className="text-2xl font-bold text-blue-400">{exp.year}</span>
                                    <FaBriefcase className="text-gray-600 mt-2" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-100">{exp.jobTitle}</h3>
                                            <p className="text-blue-400">{exp.company}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp._id)}
                                                className="text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:hidden text-sm text-gray-500 mb-2">{exp.year} | {exp.duration}</div>
                                    <div className="hidden md:block text-sm text-gray-500 mb-2">{exp.duration}</div>
                                    <p className="text-gray-400 text-sm">{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="ExperienceForm_modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                                <h2 className="text-2xl font-bold text-white">
                                    {editId ? 'Edit Experience' : 'Add Experience'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                                        <input type="text" name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="2023" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                                        <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Jan - Present" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required></textarea>
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                                    <Button
                                        type="submit"
                                        loading={submitting}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                                    >
                                        {editId ? 'Update' : 'Create'}
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

export default Experience;
