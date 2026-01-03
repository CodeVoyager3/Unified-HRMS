import React, { useState, useEffect } from 'react';
import {
    Users, CheckCircle, AlertTriangle, Trophy, Star, Award, Loader,
    ClipboardList, Package, AlertCircle, TrendingUp, Calendar,
    ShieldAlert, BadgeIndianRupee, Clock
} from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
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

    // Mock data for new features (will be replaced with API calls)
    const [specialTasks, setSpecialTasks] = useState({
        pending: 3,
        completed: 7,
        fined: 1
    });

    const [inventoryStatus, setInventoryStatus] = useState({
        lowStock: 2,
        totalItems: 8
    });

    const [challanStats, setChallanStats] = useState({
        totalRevenue: 0,
        totalChallans: 0
    });

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
                    const storedData = sessionStorage.getItem('verifiedUser');
                    if (storedData) {
                        try {
                            const userData = JSON.parse(storedData);
                            if (userData.Ward) {
                                currentWard = userData.Ward;
                                setWardNumber(userData.Ward);
                            }
                        } catch (e) {
                            console.error("Error parsing session data", e);
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

                // 3. Fetch Challan Stats
                try {
                    const challanRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/challan/stats/${currentWard}`);
                    const challanData = await challanRes.json();
                    if (challanData.success) {
                        setChallanStats(challanData.stats);
                    }
                } catch (e) {
                    console.error("Challan fetch error:", e);
                }

                // 4. Fetch Special Tasks Stats
                try {
                    const tasksRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/task/ward/${currentWard}`);
                    const tasksData = await tasksRes.json();
                    if (tasksData.success) {
                        const tasks = tasksData.tasks || [];
                        const pending = tasks.filter(t => t.status === 'Pending').length;
                        const completed = tasks.filter(t => t.status === 'Completed' || t.status === 'Verified').length;
                        const fined = tasks.filter(t => t.status === 'Fined').length;

                        setSpecialTasks({
                            pending,
                            completed,
                            fined
                        });
                    }
                } catch (e) {
                    console.error("Tasks fetch error:", e);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoadingStats(false);
                setIsLoadingPerformers(false);
            }
        };

        fetchWardData();
    }, [currentUser]);

    const mainStats = [
        {
            title: language === 'en' ? 'Total Employees' : 'कुल कर्मचारी',
            value: dashboardStats.totalEmployees,
            subtitle: `${dashboardStats.presentToday} ${language === 'en' ? 'Present Today' : 'आज उपस्थित'}`,
            icon: Users,
            color: '#6F42C1',
            bgGradient: 'from-purple-500 to-indigo-600',
            target: 'Payroll'
        },
        {
            title: language === 'en' ? 'Pending Issues' : 'लंबित मुद्दे',
            value: dashboardStats.pendingIssues,
            subtitle: language === 'en' ? 'Requires Action' : 'कार्रवाई की आवश्यकता',
            icon: AlertCircle,
            color: '#f59e0b',
            bgGradient: 'from-amber-500 to-orange-600',
            target: 'Issues'
        },
        {
            title: language === 'en' ? 'Challans Issued' : 'जारी चालान',
            value: challanStats.totalChallans,
            subtitle: `₹${challanStats.totalRevenue.toLocaleString()} ${language === 'en' ? 'Revenue' : 'राजस्व'}`,
            icon: ShieldAlert,
            color: '#ef4444',
            bgGradient: 'from-red-500 to-rose-600',
            target: 'Enforcement'
        },
        {
            title: language === 'en' ? 'Special Tasks' : 'विशेष कार्य',
            value: specialTasks.pending,
            subtitle: `${specialTasks.completed} ${language === 'en' ? 'Completed' : 'पूर्ण'}`,
            icon: ClipboardList,
            color: '#3b82f6',
            bgGradient: 'from-blue-500 to-cyan-600',
            target: 'special-tasks'
        },
        {
            title: language === 'en' ? 'Low Stock Items' : 'कम स्टॉक आइटम',
            value: inventoryStatus.lowStock,
            subtitle: `${inventoryStatus.totalItems} ${language === 'en' ? 'Total Items' : 'कुल आइटम'}`,
            icon: Package,
            color: '#8b5cf6',
            bgGradient: 'from-violet-500 to-purple-600',
            target: 'Inventory'
        }
    ];

    const quickActions = [
        {
            icon: ClipboardList,
            label: language === 'en' ? 'Assign Task' : 'कार्य सौंपें',
            color: '#6F42C1',
            target: 'special-tasks'
        },
        {
            icon: ShieldAlert,
            label: language === 'en' ? 'Issue Challan' : 'चालान जारी करें',
            color: '#ef4444',
            target: 'Enforcement'
        },
        {
            icon: CheckCircle,
            label: language === 'en' ? 'Track Issues' : 'मुद्दे ट्रैक करें',
            color: '#10b981',
            target: 'Issues'
        },
        {
            icon: BadgeIndianRupee,
            label: language === 'en' ? 'View Payroll' : 'वेतन देखें',
            color: '#3b82f6',
            target: 'Payroll'
        },
        {
            icon: Package,
            label: language === 'en' ? 'Request Stock' : 'स्टॉक अनुरोध',
            color: '#8b5cf6',
            target: 'Inventory'
        }
    ];

    const issueData = [
        { name: language === 'en' ? 'Resolved' : 'हल किया गया', value: dashboardStats.completionRate, color: '#10b981' },
        { name: language === 'en' ? 'Pending' : 'लंबित', value: 100 - dashboardStats.completionRate, color: '#f59e0b' },
    ];

    // Mock weekly activity data
    const weeklyActivity = [
        { day: 'Mon', attendance: 85, issues: 5, tasks: 3 },
        { day: 'Tue', attendance: 92, issues: 3, tasks: 5 },
        { day: 'Wed', attendance: 88, issues: 4, tasks: 4 },
        { day: 'Thu', attendance: 95, issues: 2, tasks: 6 },
        { day: 'Fri', attendance: 90, issues: 3, tasks: 5 },
        { day: 'Sat', attendance: 78, issues: 6, tasks: 2 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Ward Overview' : 'वार्ड अवलोकन'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                            <ShieldAlert size={14} />
                            {language === 'en' ? `Ward ${wardNumber}` : `वार्ड ${wardNumber}`}
                        </span>
                        <span className="text-sm">
                            {currentUser?.Zone || (language === 'en' ? 'General Zone' : 'सामान्य क्षेत्र')}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} />
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {mainStats.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={() => setActiveMenu && setActiveMenu(stat.target)}
                        className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {isLoadingStats ? <Loader className="animate-spin" size={24} /> : stat.value}
                                    </p>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-green-500" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {stat.subtitle}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'en' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveMenu && setActiveMenu(action.target)}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${action.color}15` }}
                            >
                                <action.icon size={24} style={{ color: action.color }} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performers */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy className="text-amber-500" size={24} />
                            {language === 'en' ? 'Top Performers of the Month' : 'महीने के शीर्ष कलाकार'}
                        </h3>
                    </div>
                    {isLoadingPerformers ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="animate-spin text-gray-400" size={32} />
                        </div>
                    ) : topPerformers.length > 0 ? (
                        <div className="space-y-3">
                            {topPerformers.map((performer, idx) => (
                                <div key={performer.employeeId} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {idx === 0 ? <Trophy size={20} /> : idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {performer.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {performer.employeeId} • {performer.role}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {performer.totalCredits}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {language === 'en' ? 'Credits' : 'क्रेडिट'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                            <Star className="fill-amber-400 text-amber-400" size={16} />
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
                                {language === 'en' ? 'No performance data available for this month' : 'इस महीने के लिए कोई प्रदर्शन डेटा उपलब्ध नहीं है'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Issue Status Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {language === 'en' ? 'Issue Resolution' : 'मुद्दा समाधान'}
                    </h3>

                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {issueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff', padding: '8px 12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.completionRate}%</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Resolved</span>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        {issueData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setActiveMenu && setActiveMenu('Issues')}
                        className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        {language === 'en' ? 'View All Issues' : 'सभी मुद्दे देखें'}
                    </button>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-purple-500" />
                    {language === 'en' ? 'Weekly Overview' : 'साप्ताहिक अवलोकन'}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                cursor={{ fill: 'rgba(111, 66, 193, 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="attendance" name={language === 'en' ? 'Attendance %' : 'उपस्थिति %'} fill="#6F42C1" radius={[8, 8, 0, 0]} barSize={30} />
                            <Bar dataKey="tasks" name={language === 'en' ? 'Tasks' : 'कार्य'} fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SIOverview;
