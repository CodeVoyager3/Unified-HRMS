import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, ArrowRight, Loader2, Fingerprint, Search } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const EmployeeVerification = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isfocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();

    // Auto-focus input on load
    useEffect(() => {
        const input = document.getElementById('empId');
        if (input) input.focus();
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!employeeId.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const email = user?.primaryEmailAddress?.emailAddress;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, email }),
            });

            if (!response.ok) throw new Error('Verification failed');

            const data = await response.json();

            if (data.success) {
                // Security Fix: Use sessionStorage to clear verification on tab close
                sessionStorage.setItem('verifiedUser', JSON.stringify(data.user));

                // Simulated delay for success animation
                setTimeout(() => {
                    const role = data.user.role;
                    if (role === 'Commissioner') navigate('/admin');
                    else if (role === 'Deputy Commissioner') navigate('/manager');
                    else if (role === 'Sanitary Inspector') navigate('/sanitary-inspector');
                    else navigate('/employee');
                }, 800);
            } else {
                setError(data.message || 'Invalid Employee ID.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('System error. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300 overflow-x-hidden">
            <Navbar />

            {/* Main Container */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative">

                {/* Background Decorations - Responsive Sizing */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[600px] md:h-[600px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-blue-500/5 rounded-full blur-[40px] md:blur-[80px] pointer-events-none"></div>

                <div className="w-full max-w-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Header */}
                    <div className="text-center mb-10 md:mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mb-6 ring-1 ring-gray-100 dark:ring-gray-800">
                            <Fingerprint size={32} className="text-[#6F42C1]" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Identity Verification
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            Securely access your dashboard by verifying your Unified Employee ID.
                        </p>
                    </div>

                    {/* Search Bar Input */}
                    <form onSubmit={handleVerify} className={`relative group transition-all duration-300 transform ${isfocused ? 'scale-[1.01] md:scale-[1.02]' : 'scale-100'}`}>
                        <div className={`absolute inset-0 bg-gradient-to-r from-[#6F42C1] to-purple-600 rounded-2xl blur opacity-20 transition-opacity duration-300 ${isfocused ? 'opacity-40' : 'opacity-20'}`}></div>

                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center p-2 border border-gray-200 dark:border-gray-800 gap-2 md:gap-0">
                            <div className="hidden md:block pl-6 pr-4">
                                <Search className="text-gray-400" size={24} />
                            </div>

                            <input
                                id="empId"
                                type="text"
                                value={employeeId}
                                onChange={(e) => {
                                    setEmployeeId(e.target.value);
                                    setError('');
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Employee ID (e.g. MCD-2024-X)"
                                className="flex-grow bg-transparent text-lg md:text-xl py-3 md:py-4 px-4 md:px-0 text-gray-900 dark:text-white placeholder-gray-400 outline-none font-medium text-center md:text-left"
                                autoComplete="off"
                                disabled={isLoading}
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !employeeId.trim()}
                                className={`
                                    flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-white transition-all duration-300
                                    ${isLoading || !employeeId.trim()
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#6F42C1] hover:bg-[#5a32a3] shadow-lg shadow-purple-500/20 transform hover:-translate-y-0.5 active:translate-y-0'}
                                `}
                            >
                                {isLoading ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        <span className="md:hidden">Verify</span>
                                        <ArrowRight size={24} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 py-3 px-6 rounded-xl animate-in fade-in slide-in-from-top-2 mx-4 md:mx-0 text-sm md:text-base">
                            <ShieldCheck size={18} className="shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500">
                        <p className="flex items-center justify-center gap-2">
                            <ShieldCheck size={14} />
                            Secured by Unified HRMS Encryption
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployeeVerification;