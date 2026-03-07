import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCheck, FaTimes, FaTrash, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const token = user?.token;

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/reviews/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const toggleApproval = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/reviews/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReviews();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchReviews();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="Reviews_container h-full">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Reviews
            </h1>

            {loading ? (
                <div className="text-center text-gray-400">Loading reviews...</div>
            ) : (
                <div className="Reviews_list space-y-4">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div
                                key={review._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`ReviewCard_container bg-gray-900 border ${review.isApproved ? 'border-green-500/30' : 'border-yellow-500/30'} rounded-xl p-6 hover:shadow-xl transition-all`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-3">
                                            {review.name}
                                            <span className={`text-xs px-2 py-1 rounded-full border ${review.isApproved ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                                                {review.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </h3>
                                        <div className="flex text-yellow-500 my-2 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-700'} />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleApproval(review._id)}
                                            className={`p-2 rounded-lg transition-colors ${review.isApproved ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                                            title={review.isApproved ? "Reject" : "Approve"}
                                        >
                                            {review.isApproved ? <FaTimes /> : <FaCheck />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Reviews;
