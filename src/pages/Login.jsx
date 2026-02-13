import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="Login_container flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="Login_card bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700"
            >
                <h2 className="Login_title text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Admin Login
                </h2>

                {error && (
                    <div className="Login_error bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="Login_form space-y-6">
                    <div>
                        <label className="Login_label block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="Login_input w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="Login_label block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="Login_input w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        loading={false} // Login component doesn't have a loading state variable exposed in the snippet, need to check context
                        className="Login_button w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-[1.02]"
                    >
                        Sign In
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
