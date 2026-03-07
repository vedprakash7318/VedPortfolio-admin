import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaTools } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '',
    });
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/services');
            setServices(data);
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
            if (editingService) {
                await axios.put(`http://localhost:5000/api/services/${editingService._id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/services', formData, config);
                closeModal();
                fetchServices();
            }
        } catch (error) {
            console.error(error);
            alert('Error saving service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`http://localhost:5000/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchServices();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                title: service.title,
                description: service.description,
                icon: service.icon,
            });
        } else {
            setEditingService(null);
            setFormData({
                title: '',
                description: '',
                icon: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    return (
        <div className="Services_container h-full">
            <div className="Services_header flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Services
                </h1>
                <button
                    onClick={() => openModal()}
                    className="Services_addButton flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <FaPlus /> Add Service
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading services...</div>
            ) : (
                <div className="Services_grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {services.map((service) => (
                            <motion.div
                                key={service._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="ServiceCard_container bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all hover:bg-gray-800"
                            >
                                <div className="text-4xl text-blue-500 mb-4">
                                    {/* Ideally render Icon component dynamically */}
                                    <FaTools />
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 mb-2">{service.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                                <div className="flex justify-end gap-3 text-sm">
                                    {/* <button onClick={() => openModal(service)} className="text-gray-400 hover:text-blue-400"><FaEdit /></button> */}
                                    {/* Edit disabled until backend ready */}
                                    <button onClick={() => handleDelete(service._id)} className="text-gray-400 hover:text-red-400"><FaTrash /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="ServiceForm_modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingService ? 'Edit Service' : 'Add New Service'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Service Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Icon (Class Name)</label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="e.g. FaCode"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        loading={submitting}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-bold"
                                    >
                                        {editingService ? 'Update Service' : 'Create Service'}
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

export default Services;
