import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="Layout_container flex min-h-screen bg-gray-950 text-white">
            <Sidebar />
            <main className="Layout_main flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="Layout_header flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-200">Welcome, {user?.name}</h2>
                    <div className="text-sm text-gray-400">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
};

export default Layout;
