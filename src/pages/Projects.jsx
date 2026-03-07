import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        liveLink: '',
        githubLink: '',
        category: '',
        image: null,
    });
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/projects');
            setProjects(data);
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
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('tags', formData.tags);
        data.append('liveLink', formData.liveLink);
        data.append('githubLink', formData.githubLink);
        data.append('category', formData.category);
        if (formData.image) {
            data.append('image', formData.image);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (editingProject) {
                await axios.put(`http://localhost:5000/api/projects/${editingProject._id}`, data, config);
            } else {
                await axios.post('http://localhost:5000/api/projects', data, config);
            }
            closeModal();
            fetchProjects();
        } catch (error) {
            console.error(error);
            alert('Error saving project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://localhost:5000/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchProjects();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                tags: project.tags.join(', '),
                liveLink: project.liveLink,
                githubLink: project.githubLink,
                category: project.category,
                image: null, // Don't preload file input
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                tags: '',
                liveLink: '',
                githubLink: '',
                category: '',
                image: null,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    return (
        <div className="Projects_container">
            <div className="Projects_header flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Projects
                </h1>
                <button
                    onClick={() => openModal()}
                    className="Projects_addButton flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <FaPlus /> Add Project
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading projects...</div>
            ) : (
                <div className="Projects_grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {projects.map((project) => (
                            <motion.div
                                key={project._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="ProjectCard_container bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="h-48 overflow-hidden relative group">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button onClick={() => openModal(project)} className="text-white hover:text-blue-400 text-xl"><FaEdit /></button>
                                        <button onClick={() => handleDelete(project._id)} className="text-white hover:text-red-400 text-xl"><FaTrash /></button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-100">{project.title}</h3>
                                        <span className="text-xs bg-gray-800 text-blue-400 px-2 py-1 rounded-full border border-gray-700">
                                            {project.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag, index) => (
                                            <span key={index} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 text-sm">
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:underline">
                                                <FaExternalLinkAlt /> Live Demo
                                            </a>
                                        )}
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-white hover:underline">
                                                <FaGithub /> Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="ProjectForm_modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingProject ? 'Edit Project' : 'Add New Project'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
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
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="e.g. Web App"
                                            required
                                        />
                                    </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Live Link</label>
                                        <input
                                            type="url"
                                            name="liveLink"
                                            value={formData.liveLink}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Link</label>
                                        <input
                                            type="url"
                                            name="githubLink"
                                            value={formData.githubLink}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Project Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    />
                                    {editingProject && !formData.image && (
                                        <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                                    )}
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
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                                    >
                                        {editingProject ? 'Update Project' : 'Create Project'}
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

export default Projects;
