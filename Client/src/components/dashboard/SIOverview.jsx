
import React, { useState, useEffect } from 'react';
import {
    Users, CheckCircle, AlertTriangle,
    Trophy, Star, Award, Loader
} from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const SIOverview = ({ language, setActiveMenu, currentUser }) => {
    const [topPerformers, setTopPerformers] = useState([]);
    const [isLoadingPerformers, setIsLoadingPerformers] = useState(false);
    const [wardNumber, setWardNumber] = useState(42);
    const [dashboardStats, setDashboardStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        pendingIssues: 0,
        completionRate: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Fetch Ward Data
    useEffect(() => {
        const fetchWardData = async () => {
            setIsLoadingStats(true);
            setIsLoadingPerformers(true);
            try {
                let currentWard = wardNumber;

                // Prioritize currentUser prop, then localStorage
                if (currentUser?.Ward) {
                    currentWard = currentUser.Ward;
                    setWardNumber(currentUser.Ward);
                } else {
                    const storedData = localStorage.getItem('verifiedUser');
                    if (storedData) {
                        const userData = JSON.parse(storedData);
                        if (userData.Ward) {
                            currentWard = userData.Ward;
                            setWardNumber(userData.Ward);
                        }
                    }
                }

                // 1. Fetch Stats
                try {
                    const statsRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/inspector/stats/${currentWard}`);
                    const statsData = await statsRes.json();
                    if (statsData.success) {
                        setDashboardStats(statsData.stats);
                    }
                } catch (e) {
                    console.error("Stats fetch error:", e);
                }

                // 2. Fetch Top Performers
                try {
                    const perfRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/credit/top-performers/${currentWard}?limit=5`);
                    const perfData = await perfRes.json();
                    if (perfData.success) {
                        setTopPerformers(perfData.performers || []);
                    }
                } catch (e) {
                    console.error("Performers fetch error:", e);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoadingStats(false);
                setIsLoadingPerformers(false);
            }
        };

        fetchWardData();
    }, [currentUser]); // Add currentUser dependency

    const stats = [
        {
            title: language === 'en' ? 'WARD EMPLOYEES' : 'वार्ड कर्मचारी',
            value: dashboardStats.totalEmployees,
            change: `${dashboardStats.presentToday} Present`,
            trend: 'up',
            icon: Users,
            color: '#6F42C1', // Purple
            target: 'Payroll'
        },
        {
            title: language === 'en' ? 'PENDING ISSUES' : 'लंबित मुद्दे',
            value: dashboardStats.pendingIssues,
            change: language === 'en' ? 'Needs Action' : 'कार्रवाई की आवश्यकता',
            trend: 'down',
            icon: AlertTriangle,
            color: '#f59e0b', // Amber
            target: 'Issues'
        },
        {
            title: language === 'en' ? 'COMPLETION RATE' : 'समापन दर',
            value: `${dashboardStats.completionRate}%`,
            change: language === 'en' ? 'Resolved Total' : 'कुल हल',
            trend: 'up',
            icon: CheckCircle,
            color: '#10b981', // Green
            target: 'Issues'
        },
    ];

    // Issue Status Distribution (Live or Mock? User said "everywhere". I can mock for now or calculate from stats)
    // Stats API only returns counts. I'll mock distribution or just use the stats I have.
    // I already key-off completion rate.
    const issueData = [
        { name: language === 'en' ? 'Resolved' : 'हल किया गया', value: dashboardStats.completionRate, color: '#10b981' },
        { name: language === 'en' ? 'Pending' : 'लंबित', value: 100 - dashboardStats.completionRate, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Ward Overview' : 'वार्ड अवलोकन'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en'
                            ? `Monitoring Ward ${wardNumber} - ${currentUser?.Zone || 'General'}`
                            : `वार्ड ${wardNumber} - ${currentUser?.Zone || 'सामान्य'} की निगरानी`}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={() => setActiveMenu && setActiveMenu(stat.target)}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {stat.title}
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {isLoadingStats ? <Loader className="animate-spin" size={20} /> : stat.value}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-amber-500'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: `${stat.color}15` }}
                            >
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performers of the Month */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy className="text-amber-500" size={20} />
                            {language === 'en' ? 'Top Performers of the Month' : 'महीने के शीर्ष कलाकार'}
                        </h3>
                    </div>
                    {isLoadingPerformers ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="animate-spin text-gray-400" size={32} />
                        </div>
                    ) : topPerformers.length > 0 ? (
                        <div className="space-y-4">
                            {topPerformers.map((performer, idx) => (
                                <div key={performer.employeeId} className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors">
                                    {/* Rank Badge */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {idx === 0 ? <Trophy size={18} /> : idx + 1}
                                    </div>
                                    {/* Employee Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {performer.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {performer.employeeId} • {performer.role}
                                        </p>
                                    </div>
                                    {/* Credit Score */}
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {performer.totalCredits}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {language === 'en' ? 'Credits' : 'क्रेडिट'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="fill-amber-400 text-amber-400" size={20} />
                                            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                {performer.averageCredit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Award className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {language === 'en'
                                    ? 'No performance data available for this month'
                                    : 'इस महीने के लिए कोई प्रदर्शन डेटा उपलब्ध नहीं है'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Issue Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveMenu && setActiveMenu('Issues')}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {language === 'en' ? 'Issue Status' : 'मुद्दे की स्थिति'}
                    </h3>

                    <div className="flex-1 min-h-[200px] relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {issueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.completionRate}%</span>
                            <span className="text-[10px] text-gray-400">Resolved</span>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        {issueData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SIOverview;
