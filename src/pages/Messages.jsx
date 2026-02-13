import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEnvelopeOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/contact', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await axios.delete(`http://localhost:5000/api/contact/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchMessages();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="Messages_container h-full">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Messages
            </h1>

            {loading ? (
                <div className="text-center text-gray-400">Loading messages...</div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                        {messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-100">{msg.name}</h3>
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{msg.email}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <p className="text-xs text-gray-600 mt-4">
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ml-4"
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
        </div>
    );
};

export default Messages;
