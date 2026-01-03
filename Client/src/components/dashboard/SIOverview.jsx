import React, { useState, useEffect } from 'react';
import {
    Users, CheckCircle, AlertTriangle,
    Trophy, Star, Award, Loader
} from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const SIOverview = ({ language }) => {
    const [topPerformers, setTopPerformers] = useState([]);
    const [isLoadingPerformers, setIsLoadingPerformers] = useState(false);
    const [wardNumber, setWardNumber] = useState(42); // Default ward, can be fetched from user data

    // Fetch top performers based on credits
    useEffect(() => {
        const fetchTopPerformers = async () => {
            setIsLoadingPerformers(true);
            try {
                // Get ward from localStorage or use default
                let currentWard = wardNumber;
                const storedData = localStorage.getItem('verifiedUser');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    if (userData.Ward) {
                        currentWard = userData.Ward;
                        setWardNumber(userData.Ward);
                    }
                }

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URI}/credit/top-performers/${currentWard}?limit=5`
                );
                const data = await response.json();
                if (data.success) {
                    setTopPerformers(data.performers || []);
                }
            } catch (error) {
                console.error('Error fetching top performers:', error);
            } finally {
                setIsLoadingPerformers(false);
            }
        };

        fetchTopPerformers();
    }, []);

    // Stats specific to Sanitation Inspector (removed AVG QUALITY RATING)
    const stats = [
        {
            title: language === 'en' ? 'WARD EMPLOYEES' : 'वार्ड कर्मचारी',
            value: '45',
            change: '42 Present',
            trend: 'up',
            icon: Users,
            color: '#6F42C1' // Purple
        },
        {
            title: language === 'en' ? 'PENDING ISSUES' : 'लंबित मुद्दे',
            value: '8',
            change: '+2 New',
            trend: 'down', // high pending is bad, but here we just show count
            icon: AlertTriangle,
            color: '#f59e0b' // Amber
        },
        {
            title: language === 'en' ? 'RESOLVED TODAY' : 'आज निपटाए गए',
            value: '12',
            change: '+5 vs yest',
            trend: 'up',
            icon: CheckCircle,
            color: '#10b981' // Green
        },
    ];

    // Issue Status Distribution
    const issueData = [
        { name: language === 'en' ? 'Resolved' : 'हल किया गया', value: 65, color: '#10b981' },
        { name: language === 'en' ? 'Pending' : 'लंबित', value: 25, color: '#f59e0b' },
        { name: language === 'en' ? 'Critical' : 'महत्वपूर्ण', value: 10, color: '#ef4444' },
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
                        {language === 'en' ? 'Monitor your ward performance and issues.' : 'अपने वार्ड के प्रदर्शन और मुद्दों की निगरानी करें।'}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {stat.title}
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.value}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-amber-500'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
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
                        <button
                            onClick={async () => {
                                setIsLoadingPerformers(true);
                                try {
                                    const response = await fetch(
                                        `${import.meta.env.VITE_BACKEND_URI}/credit/top-performers/${wardNumber}?limit=5`
                                    );
                                    const data = await response.json();
                                    if (data.success) {
                                        setTopPerformers(data.performers || []);
                                    }
                                } catch (error) {
                                    console.error('Error fetching top performers:', error);
                                } finally {
                                    setIsLoadingPerformers(false);
                                }
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {language === 'en' ? 'Refresh' : 'रीफ्रेश'}
                        </button>
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
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                        idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
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
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 flex flex-col">
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
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">100%</span>
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
