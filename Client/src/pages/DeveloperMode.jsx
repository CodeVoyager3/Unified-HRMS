import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import { wardData } from '../data/wardData';
import { AlertTriangle, CheckCircle, Trash2, Clock, User as UserIcon, Shield, Copy, Info, ArrowRight, Zap, Database, Eye } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DeveloperMode = () => {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const [activeProfile, setActiveProfile] = useState(null);
    const [createdUser, setCreatedUser] = useState(null);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        role: 'Staff',
        department: '',
        zone: '',
        ward: ''
    });

    const uniqueZones = [...new Set(wardData.map(item => item.zone))].sort();
    const availableWards = wardData
        .filter(w => w.zone === formData.zone)
        .sort((a, b) => a.id - b.id);

    useEffect(() => {
        if (user && user.primaryEmailAddress) {
            setFormData(prev => ({ ...prev, name: user.fullName || '' }));
            checkActiveProfile();
        }
    }, [user]);

    const checkActiveProfile = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/developer/status`, {
                email: user.primaryEmailAddress.emailAddress
            });
            if (res.data.hasActiveProfile) {
                setActiveProfile(res.data.user);
                setCreatedUser(null);
            } else {
                setActiveProfile(null);
            }
        } catch (err) {
            console.error("Error checking profile:", err);
        }
    };

    const handleDeleteProfile = async () => {
        if (!confirm("Are you sure you want to delete your temporary profile?")) return;
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URI}/developer/delete`, {
                email: user.primaryEmailAddress.emailAddress
            });
            setActiveProfile(null);
            setCreatedUser(null);
            setSuccessMsg("Profile deleted successfully.");
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (formData.role === 'Deputy Commissioner' && !formData.zone) throw new Error("Please select a Zone");
            if ((formData.role === 'Sanitary Inspector' || formData.role === 'Staff' || formData.role === 'Worker') && (!formData.zone || !formData.ward)) throw new Error("Please select Zone and Ward");

            const payload = {
                name: formData.name,
                email: user.primaryEmailAddress.emailAddress,
                role: formData.role,
                department: formData.department,
                zone: formData.zone,
                ward: formData.ward
            };

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/developer/create`, payload);
            if (res.data.success) {
                setCreatedUser(res.data.user);
                setSuccessMsg("Temporal Profile Generated!");
                setActiveProfile(res.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("✓ Copied to clipboard!");
    };

    if (!isLoaded) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

                {/* Header Section with Gradient */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-orange-200 dark:border-orange-800">
                        <Zap size={16} className="animate-pulse" />
                        BETA FEATURE
                    </div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 dark:from-orange-400 dark:via-purple-400 dark:to-blue-400 mb-4">
                        Exploration Sandbox
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Experience the complete HRMS ecosystem by creating temporary demo accounts. Explore role-based dashboards, zone-specific data, and ward-level operations without affecting production data.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* How it Works */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Eye className="text-blue-600 dark:text-blue-400" size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">How It Works</h3>
                        </div>
                        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                                <span>Choose a role to explore its specific dashboard and permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center">2</span>
                                <span>Assign zone/ward context to experience data segregation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-bold flex items-center justify-center">3</span>
                                <span>Use the generated EID to login and explore</span>
                            </li>
                        </ol>
                    </motion.div>

                    {/* Auto-Delete Warning */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800/50 shadow-lg"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-red-800 dark:text-red-300 font-bold text-lg mb-2">Temporary Data</h3>
                                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                                    All demo accounts are <strong>automatically deleted</strong> after <strong className="text-base">10 minutes</strong> to maintain system hygiene. No permanent data is stored.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Safe Exploration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Database className="text-green-600 dark:text-green-400" size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Safe Sandbox</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Explore freely without worrying about corrupting production data. All actions are isolated and will be automatically cleaned up.
                        </p>
                    </motion.div>
                </div>

                {/* Main Action Area */}
                {createdUser ? (
                    // SUCCESS VIEW WITH EID
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-4 border-green-400 dark:border-green-600 p-10 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-600 dark:text-green-400 mb-6 shadow-lg"
                        >
                            <CheckCircle size={40} />
                        </motion.div>

                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Demo Account Ready!</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
                            Your temporary profile has been generated. You have <strong className="text-orange-600 dark:text-orange-400">10 minutes</strong> before auto-deletion.
                        </p>

                        {/* EID Display - MOST PROMINENT */}
                        <div className="max-w-2xl mx-auto mb-10">
                            <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                                Employee ID (EID) — Required for Login
                            </label>
                            <div className="relative">
                                <code className="block text-5xl md:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 py-6 tracking-wider">
                                    {createdUser.employeeId}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(createdUser.employeeId)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                    title="Copy EID"
                                >
                                    <Copy size={24} />
                                </button>
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center justify-center gap-2">
                                    <Info size={16} />
                                    Use this EID + your email ({user.primaryEmailAddress.emailAddress}) to login
                                </p>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Role</span>
                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{createdUser.role}</span>
                            </div>
                            {createdUser.Zone && (
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Zone</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{createdUser.Zone}</span>
                                </div>
                            )}
                            {createdUser.Ward && (
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Ward</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{createdUser.Ward}</span>
                                </div>
                            )}
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                <span className="block text-xs text-orange-600 dark:text-orange-400 font-bold uppercase mb-1 flex items-center gap-1">
                                    <Clock size={12} /> Expires
                                </span>
                                <span className="text-sm font-mono font-bold text-orange-700 dark:text-orange-400">
                                    {new Date(createdUser.temporaryExpiresAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={handleDeleteProfile}
                                className="px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold transition-colors border border-red-200 dark:border-red-800"
                            >
                                Delete & Start Over
                            </button>
                            <a
                                href="/verify-employee"
                                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                            >
                                Access Employee Portal <ArrowRight size={20} />
                            </a>
                        </div>
                    </motion.div>
                ) : activeProfile ? (
                    // ACTIVE PROFILE VIEW
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-purple-100 dark:border-gray-700 p-8"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                    <Shield className="text-green-500" size={32} /> Active Demo Session
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">You currently have an active temporary profile.</p>
                            </div>
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-5 py-2 rounded-full text-sm font-bold border-2 border-green-200 dark:border-green-700 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> LIVE
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                                <span className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Assigned Role</span>
                                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{activeProfile.role}</span>
                            </div>
                            {activeProfile.zone && (
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Zone</span>
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeProfile.zone}</span>
                                </div>
                            )}
                            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-700">
                                <span className="block text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Clock size={14} /> Auto-Delete
                                </span>
                                <span className="text-xl font-mono font-black text-orange-700 dark:text-orange-400 block">
                                    {new Date(activeProfile.expiresAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDeleteProfile}
                            disabled={loading}
                            className="w-full py-5 bg-white hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900/20 border-2 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                        >
                            <Trash2 size={22} />
                            {loading ? 'Terminating...' : 'Terminate Session & Create New'}
                        </button>
                    </motion.div>
                ) : (
                    // CREATE FORM
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        <div className="p-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
                            <h2 className="text-3xl font-black flex items-center gap-3">
                                <UserIcon size={32} /> Create Demo Profile
                            </h2>
                            <p className="text-purple-100 mt-2">Configure your temporary exploration account</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleCreateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Role Type</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value, zone: '', ward: '' })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="Staff">Staff / Employee</option>
                                            <option value="Sanitary Inspector">Sanitary Inspector</option>
                                            <option value="Deputy Commissioner">Deputy Commissioner</option>
                                            <option value="Commissioner">Commissioner</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.role === 'Staff' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Department</label>
                                        <select
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Sanitation">Sanitation</option>
                                            <option value="Road Maintenance">Road Maintenance</option>
                                            <option value="Health">Health</option>
                                            <option value="Education">Education</option>
                                            <option value="Transport">Transport</option>
                                        </select>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formData.role !== 'Commissioner' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                        >
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Zone</label>
                                            <select
                                                value={formData.zone}
                                                onChange={(e) => setFormData({ ...formData, zone: e.target.value, ward: '' })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                required
                                            >
                                                <option value="">-- Select Zone --</option>
                                                {uniqueZones.map((z, idx) => (
                                                    <option key={idx} value={z}>{z}</option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    )}

                                    {(formData.role === 'Sanitary Inspector' || formData.role === 'Staff') && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                        >
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ward</label>
                                            <select
                                                value={formData.ward}
                                                onChange={(e) => setFormData({ ...formData, ward: parseInt(e.target.value) })}
                                                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${!formData.zone ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={!formData.zone}
                                                required
                                            >
                                                <option value="">-- Select Ward --</option>
                                                {availableWards.map((w) => (
                                                    <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    )}
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 font-medium"
                                    >
                                        <AlertTriangle size={20} /> {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Generating Profile...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={24} />
                                            Generate Demo Account
                                            <ArrowRight size={24} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DeveloperMode;
