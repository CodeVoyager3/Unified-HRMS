import React, { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import {
    Users, Building2, TrendingUp, AlertCircle, MapPin, CheckCircle,
    Clock, Activity, ArrowUpRight, Bell, Zap, MessageSquare, DollarSign, FileText,
    IndianRupee, Briefcase // Added IndianRupee
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DelhiZoneMap from '../dashboard/DelhiZoneMap';

const CityWideOverview = ({ language, onNavigate }) => {
    const [cityStats, setCityStats] = useState(null);
    const [zoneComparison, setZoneComparison] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [departmentTrends, setDepartmentTrends] = useState([]);



    useEffect(() => {
        fetchCityData();
    }, []);

    const fetchCityData = async () => {
        setLoading(true);
        try {
            // Fetch all data in parallel
            const [statsRes, zonesRes, alertsRes, trendsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/city-stats`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/zone-comparison`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/alerts`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/city-trends`)
            ]);

            const statsData = await statsRes.json();
            const zonesData = await zonesRes.json();
            const alertsData = await alertsRes.json();
            const trendsData = await trendsRes.json();

            if (statsData.success) setCityStats(statsData.stats);
            if (zonesData.success) setZoneComparison(zonesData.zones);
            if (alertsData.success) setAlerts(alertsData.alerts);
            if (trendsData.success) setDepartmentTrends(trendsData.trends);
        } catch (error) {
            console.error('Error fetching city data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = cityStats ? [
        {
            title: language === 'en' ? 'Revenue Collection' : 'राजस्व संग्रह',
            value: cityStats.revenueCollection || '₹0',
            change: '+2.5%', // Keep trend mock for now or calc if history exists
            trend: 'up',
            icon: IndianRupee,
            gradient: 'from-emerald-500 to-teal-600',
            color: '#059669',
            target: 'Financial'
        },
        {
            title: language === 'en' ? 'Active Zones' : 'सक्रिय क्षेत्र',
            value: cityStats.totalZones || '0',
            change: '100% Operational',
            trend: 'stable',
            icon: MapPin,
            gradient: 'from-blue-500 to-indigo-600',
            color: '#4f46e5',
            target: 'ZoneAnalytics'
        },
        {
            title: language === 'en' ? 'Avg Performance' : 'औसत प्रदर्शन',
            value: `${cityStats.averagePerformance || 0}%`,
            change: cityStats.averagePerformance > 75 ? '+1.2%' : '-0.5%',
            trend: cityStats.averagePerformance > 75 ? 'up' : 'down',
            icon: Activity,
            gradient: 'from-purple-500 to-fuchsia-600',
            color: '#9333ea',
            target: 'ZoneAnalytics'
        },
        {
            title: language === 'en' ? 'Pending Approvals' : 'लंबित अनुमोदन',
            value: cityStats.pendingApprovals || '0',
            change: cityStats.pendingApprovals > 20 ? 'High' : 'Normal',
            trend: cityStats.pendingApprovals > 20 ? 'up' : 'stable',
            icon: Clock,
            gradient: 'from-amber-500 to-orange-600',
            color: '#ea580c',
            target: 'ApprovalCenter'
        }
    ] : [];

    const quickActions = [
        { label: language === 'en' ? 'Review Grievances' : 'शिकायतों की समीक्षा करें', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', target: 'Grievances' },
        { label: language === 'en' ? 'Allocate Budget' : 'बजट आवंटित करें', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', target: 'Financial' },
        { label: language === 'en' ? 'Issue Notice' : 'नोटिस जारी करें', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', target: 'Notices' }
    ];

    const getPriorityBadge = (priority) => {
        const badges = {
            critical: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
            high: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
            low: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
        };
        return badges[priority] || badges.medium;
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-40 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[500px] rounded-2xl" />
                    <Skeleton className="lg:col-span-1 h-[500px] rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'City-Wide Overview' : 'शहर-व्यापी अवलोकन'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'Municipal Corporation of Delhi - Executive Dashboard' : 'दिल्ली नगर निगम - कार्यकारी डैशबोर्ड'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCityData}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/30"
                    >
                        <Activity size={18} />
                        {language === 'en' ? 'Refresh Data' : 'डेटा रिफ्रेश करें'}
                    </button>
                </div>
            </div>

            {/* Statistics Cards - Clickable for Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={() => onNavigate && onNavigate(stat.target)}
                        className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon size={26} className="text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {stat.trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                                {stat.trend === 'down' && <TrendingUp size={14} className="text-red-500 rotate-180" />}
                                <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {language === 'en' ? 'vs last month' : 'पिछले माह से'}
                                </span>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => onNavigate && onNavigate(action.target)}
                        className={`flex items-center gap-3 p-4 rounded-xl border border-transparent transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-gray-900 ${action.bg}`}
                    >
                        <div className={`p-2.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${action.color}`}>
                            <action.icon size={20} />
                        </div>
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 text-left line-clamp-1">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Map and Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map (Takes up 2 columns) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? 'Live Zone Map' : 'लाइव ज़ोन मैप'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live Updates
                        </div>
                    </div>
                    <DelhiZoneMap language={language} zoneStats={zoneComparison} />
                </div>

                {/* Critical Alerts (Takes up 1 column Side-by-Side) */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                                <Bell size={20} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {language === 'en' ? 'Critical Alerts' : 'महत्वपूर्ण अलर्ट'}
                            </h3>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                            {alerts.length > 0 ? alerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <AlertCircle size={20} className={`flex-shrink-0 mt-0.5 ${alert.priority === 'critical' ? 'text-red-700' : 'text-orange-600'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {alert.title}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                            {alert.message}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${getPriorityBadge(alert.priority)}`}>
                                        {alert.priority}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-500">
                                    <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                    <p>No critical alerts</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-800/50">
                            <button className="w-full py-2 text-sm text-red-700 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                {language === 'en' ? 'View All Alerts' : 'सभी अलर्ट देखें'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW Charts Row - Strategic & Actions */}
            <div className="grid grid-cols-1 gap-6">

                {/* Chart 1: Department Efficiency Timeline */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? 'Department Efficiency Trends' : 'विभाग दक्षता रुझान'}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Sanitation</span>
                            <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Health</span>
                            <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>Eng.</span>
                        </div>
                    </div>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={departmentTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.1} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="Sanitation" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="Health" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Engineering" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CityWideOverview;
