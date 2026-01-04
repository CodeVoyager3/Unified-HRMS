import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GrievanceMonitoring = ({ language }) => {
    const [overview, setOverview] = useState(null);
    const [escalated, setEscalated] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGrievanceData();
    }, []);

    const fetchGrievanceData = async () => {
        setLoading(true);
        try {
            const [overviewRes, escalatedRes, trendsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/grievances/overview`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/grievances/escalated`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/grievances/trends`)
            ]);

            const overviewData = await overviewRes.json();
            const escalatedData = await escalatedRes.json();
            const trendsData = await trendsRes.json();

            if (overviewData.success) setOverview(overviewData.overview);
            if (escalatedData.success) setEscalated(escalatedData.grievances);
            if (trendsData.success) setTrends(trendsData.trends);
        } catch (error) {
            console.error('Error fetching grievance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = [
        { name: 'Resolved', color: '#10b981' },
        { name: 'In Progress', color: '#f59e0b' },
        { name: 'Pending', color: '#ef4444' },
        { name: 'Forwarded', color: '#6366f1' }
    ];

    const priorityColors = [
        { name: 'Critical', color: '#ef4444' },
        { name: 'High', color: '#f59e0b' },
        { name: 'Medium', color: '#eab308' },
        { name: 'Low', color: '#3b82f6' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Grievance Monitoring' : 'शिकायत निगरानी'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'City-wide grievance tracking and resolution analytics' : 'शहर-व्यापी शिकायत ट्रैकिंग और समाधान विश्लेषण'}
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {overview?.total || 0}
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {language === 'en' ? 'Total Grievances' : 'कुल शिकायतें'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                            <CheckCircle size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {overview?.byStatus?.find(s => s._id === 'Resolved')?.count || 0}
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {language === 'en' ? 'Resolved' : 'हल किया गया'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                            <AlertCircle size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {overview?.criticalGrievances?.length || 0}
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {language === 'en' ? 'Critical Unresolved' : 'महत्वपूर्ण अनसुलझा'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                            <Clock size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {overview?.avgResolutionTime || 0}
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {language === 'en' ? 'Avg Resolution (days)' : 'औसत समाधान (दिन)'}
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        {language === 'en' ? 'Status Distribution' : 'स्थिति वितरण'}
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={overview?.byStatus || []}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {overview?.byStatus?.map((entry, index) => {
                                        const color = statusColors.find(c => c.name === entry._id);
                                        return <Cell key={`cell-${index}`} fill={color?.color || '#6b7280'} />;
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resolution Trends */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        {language === 'en' ? 'Resolution Trends' : 'समाधान रुझान'}
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.1} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name={language === 'en' ? 'Total' : 'कुल'}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="resolved"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name={language === 'en' ? 'Resolved' : 'हल किया गया'}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Zone Performance */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    {language === 'en' ? 'Zone-wise Grievance Performance' : 'क्षेत्रवार शिकायत प्रदर्शन'}
                </h3>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={overview?.byZone || []} margin={{ bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.1} />
                            <XAxis
                                dataKey="zone"
                                angle={-45}
                                textAnchor="end"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                height={80}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="resolved" fill="#10b981" name={language === 'en' ? 'Resolved' : 'हल किया गया'} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pending" fill="#ef4444" name={language === 'en' ? 'Pending' : 'लंबित'} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Escalated Grievances */}
            {escalated.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? 'Escalated Grievances' : 'वृद्धि की गई शिकायतें'}
                        </h3>
                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-bold">
                            {escalated.length} {language === 'en' ? 'Urgent' : 'तत्काल'}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {escalated.slice(0, 5).map((grievance, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                            {grievance.Title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {grievance.Description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Ward: {grievance.ward}</span>
                                            <span>Category: {grievance.category}</span>
                                            <span>{new Date(grievance.Date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                        {language === 'en' ? 'Review' : 'समीक्षा करें'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrievanceMonitoring;
