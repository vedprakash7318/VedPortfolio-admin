import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaUpload } from 'react-icons/fa';
import Button from '../components/ui/Button';

const Settings = () => {
    const { user } = useAuth();
    const token = user?.token;

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        bio: '',
        resumeLink: '',
        whatsapp: '',
        github: '',
        linkedin: '',
        twitter: '',
        email: '',
        phone: '',
        profileImage: '',
        footerText: ''
    });
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/settings');
            if (data) setFormData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Important for file upload
                }
            };

            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }
            // Helper to append files if they exist in state (we need to track files differently)
            // But here let's assume formData state holds the file object if changed? 
            // Better to manage file state separately or reuse formData if careful.
            // Let's modify handleFileChange.

            await axios.put('http://localhost:5000/api/settings', data, config);
            setStatus('success');
            // Refresh settings to get new URLs
            fetchSettings();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Site Settings & Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Hero Section</h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Hero Title</label>
                            <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
                            <input type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Roles (Comma separated for animation)</label>
                            <input type="text" name="roles" value={formData.roles || ''} onChange={handleChange} placeholder="e.g. Developer, Designer, Creator" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Profile Links */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Profile & Links</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Upload Resume (PDF)</label>
                            <div className="flex gap-2 items-center">
                                <input type="file" name="resume" accept="application/pdf" onChange={handleFileChange} className="bg-gray-800 text-white text-sm p-2 rounded w-full" />
                                {formData.resumeLink && typeof formData.resumeLink === 'string' && (
                                    <a href={formData.resumeLink} target="_blank" rel="noreferrer" className="text-blue-400 text-xs whitespace-nowrap">View Current</a>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
                            <div className="flex gap-2 items-center">
                                <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="bg-gray-800 text-white text-sm p-2 rounded w-full" />
                                {formData.profileImage && typeof formData.profileImage === 'string' && (
                                    <img src={formData.profileImage} alt="Current" className="w-8 h-8 rounded-full border border-gray-600" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">WhatsApp Number (e.g. 919876543210)</label>
                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <input type="text" name="bio" value={formData.bio} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Social Media</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                            <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Twitter URL</label>
                            <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Footer Text</label>
                            <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    loading={status === 'saving'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <FaSave /> {status === 'saving' ? 'Saving...' : 'Save Settings'}
                </Button>
                {status === 'success' && <p className="text-green-500 text-center">Settings saved successfully!</p>}
                {status === 'error' && <p className="text-red-500 text-center">Error saving settings. Please try again.</p>}
            </form>
        </div>
    );
};

export default Settings;
