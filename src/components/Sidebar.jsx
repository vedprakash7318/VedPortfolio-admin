import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaBriefcase, FaImages, FaStar, FaEnvelope, FaCog, FaSignOutAlt, FaTools, FaLayerGroup } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/dashboard/projects', label: 'Projects', icon: <FaProjectDiagram /> },
        { path: '/dashboard/services', label: 'Services', icon: <FaTools /> },
        { path: '/dashboard/experience', label: 'Experience', icon: <FaBriefcase /> },
        { path: '/dashboard/gallery', label: 'Gallery', icon: <FaImages /> },
        { path: '/dashboard/reviews', label: 'Reviews', icon: <FaStar /> },
        { path: '/dashboard/messages', label: 'Messages', icon: <FaEnvelope /> },
        { path: '/dashboard/settings', label: 'Settings', icon: <FaCog /> },
    ];

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white';
    };

    return (
        <div className="Sidebar_container w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`Sidebar_link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="Sidebar_logout w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
