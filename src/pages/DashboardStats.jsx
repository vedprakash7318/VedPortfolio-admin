import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { FaProjectDiagram, FaBriefcase, FaImages, FaStar, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

// DashboardStats component displays authenticated statistics

import { useAuth } from '../context/AuthContext';

const DashboardStats = () => {
    const { user } = useAuth();
    const token = user?.token;
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [proj, serv, exp, gal, rev, cont] = await Promise.all([
                    api.get('/api/projects'),
                    api.get('/api/services'),
                    api.get('/api/experience'),
                    api.get('/api/gallery'),
                    api.get('/api/reviews/all', config),
                    api.get('/api/contact', config)
                ]);

                setStats({
                    projects: proj.data.length,
                    services: serv.data.length,
                    experience: exp.data.length,
                    gallery: gal.data.length,
                    reviews: rev.data.length,
                    contacts: cont.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        getStats();
    }, [token]);

    const statCards = [
        { label: 'Total Projects', value: stats?.projects, icon: <FaProjectDiagram />, color: 'from-blue-500 to-blue-600' },
        { label: 'Services', value: stats?.services, icon: <FaBriefcase />, color: 'from-purple-500 to-purple-600' },
        { label: 'Experience', value: stats?.experience, icon: <FaStar />, color: 'from-green-500 to-green-600' },
        { label: 'Gallery Images', value: stats?.gallery, icon: <FaImages />, color: 'from-pink-500 to-pink-600' },
        { label: 'Reviews', value: stats?.reviews, icon: <FaStar />, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Messages', value: stats?.contacts, icon: <FaEnvelope />, color: 'from-red-500 to-red-600' },
    ];

    if (loading) return <div className="text-white">Loading Stats...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl shadow-lg text-white`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg opacity-80 mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-bold">{stat.value || 0}</h3>
                            </div>
                            <div className="text-4xl opacity-50">
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default DashboardStats;
