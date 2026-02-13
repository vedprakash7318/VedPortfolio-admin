import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaProjectDiagram, FaBriefcase, FaImages, FaStar, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        projects: 0,
        services: 0,
        experience: 0,
        gallery: 0,
        reviews: 0,
        contacts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        // ideally, creating a single stats endpoint is better, but fetching all separately works for now
        try {
            const [proj, serv, exp, gal, rev, cont] = await Promise.all([
                axios.get('http://localhost:5000/api/projects'),
                axios.get('http://localhost:5000/api/services'),
                axios.get('http://localhost:5000/api/experience'),
                axios.get('http://localhost:5000/api/gallery'),
                axios.get('http://localhost:5000/api/reviews/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), // Assuming token stored, but AuthContext handles it. 
                // Wait, useAuth gives token. I should use useAuth or just ignore auth for public GETs where possible, but reviews/contacts need auth for full count probably?
                // Actually public GETs return all for some.
                // Let's rely on what we have. 
                // For simplicy, I'll allow "public" count or just assume I need auth context here.
                // Re-writing to use AuthContext would be better but I can't easily hook into it here without importing.
                // I'll skip Auth for now and just catch errors if any. 
                // Note: Reviews/All requires Admin. Contacts requires Admin.
            ]);
            // Better to fail gracefully or mock if auth missing for this quick view

            setStats({
                projects: proj.data.length,
                services: serv.data.length,
                experience: exp.data.length,
                gallery: gal.data.length,
                // reviews: rev.data.length, // This might fail if not authenticated in axios defaults
                // contacts: cont.data.length 
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // To properly fetch authenticated data, I should create a Stats Component that uses useAuth
    // Resuming with a clean Component approach below...

    return <DashboardStats />; // exporting cleaner component
};

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
                    axios.get('http://localhost:5000/api/projects'),
                    axios.get('http://localhost:5000/api/services'),
                    axios.get('http://localhost:5000/api/experience'),
                    axios.get('http://localhost:5000/api/gallery'),
                    axios.get('http://localhost:5000/api/reviews/all', config),
                    axios.get('http://localhost:5000/api/contact', config)
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
