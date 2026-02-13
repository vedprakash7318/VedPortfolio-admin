import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: null,
    });
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/gallery');
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
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('image', formData.image);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.post('http://localhost:5000/api/gallery', data, config);
            closeModal();
            fetchGallery();
        } catch (error) {
            console.error(error);
            alert('Error saving image');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchGallery();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openModal = () => {
        setFormData({
            title: '',
            category: '',
            image: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="Gallery_container h-full">
            <div className="Gallery_header flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Gallery
                </h1>
                <button
                    onClick={openModal}
                    className="Gallery_addButton flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <FaPlus /> Add Image
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading gallery...</div>
            ) : (
                <div className="Gallery_grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="GalleryCard_container bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group relative"
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.image}
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                        muted
                                        loop // Optional: play on hover or just show thumbnail
                                        onMouseOver={event => event.target.play()}
                                        onMouseOut={event => event.target.pause()}
                                    />
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold">{item.title}</h3>
                                    <p className="text-blue-400 text-sm mb-2">{item.category}</p>
                                    <button onClick={() => handleDelete(item._id)} className="self-end text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full">
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
                    <div className="GalleryForm_modal fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-800">
                                <h2 className="text-2xl font-bold text-white">Add Image</h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Workshop, Certificate" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Upload Image or Video</label>
                                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                                    <Button
                                        type="submit"
                                        loading={submitting}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                                    >
                                        Upload
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

export default Gallery;
