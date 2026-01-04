import React, { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { MapPin, TrendingUp, Users, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ZonePerformanceAnalytics = ({ language }) => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchZoneData();
    }, []);

    const fetchZoneData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/zone-comparison`);
            const data = await response.json();

            if (data.success) {
                setZones(data.zones);
                if (data.zones.length > 0) {
                    setSelectedZone(data.zones[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching zone data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceColor = (score) => {
        if (score >= 75) return 'text-green-600 dark:text-green-400';
        if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getPerformanceBg = (score) => {
        if (score >= 75) return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
        if (score >= 50) return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
        return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700">
                    <p className="font-semibold text-sm">{payload[0].payload.zone}</p>
                    <p className="text-xs text-gray-300 mt-1">
                        Score: <span className="font-bold text-purple-400">{payload[0].value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>
                <Skeleton className="h-[400px] rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-64 rounded-2xl" />
                    ))}
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
                        {language === 'en' ? 'Zone Performance Analytics' : 'क्षेत्र प्रदर्शन विश्लेषण'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'Comprehensive analysis of all zones across Delhi' : 'दिल्ली भर के सभी क्षेत्रों का व्यापक विश्लेषण'}
                    </p>
                </div>
            </div>

            {/* Performance Overview Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? 'Zone Performance Comparison' : 'क्षेत्र प्रदर्शन तुलना'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {language === 'en' ? 'Average ward scores by zone' : 'क्षेत्र के अनुसार औसत वार्ड स्कोर'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-400">75+</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-400">50-74</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-400">&lt;50</span>
                        </div>
                    </div>
                </div>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={zones} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
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
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar
                                dataKey="avgScore"
                                fill="#6F42C1"
                                radius={[8, 8, 0, 0]}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Zone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedZone(zone)}
                        className={`relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${selectedZone?.zone === zone.zone
                            ? 'border-purple-500 shadow-xl shadow-purple-500/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg'
                            }`}
                    >
                        {/* Performance Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border-2 font-bold text-sm ${getPerformanceBg(zone.avgScore)}`}>
                            {zone.avgScore}%
                        </div>

                        {/* Zone Info */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {zone.zone}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {zone.wardCount} {language === 'en' ? 'Wards' : 'वार्ड'} • {zone.staffCount} {language === 'en' ? 'Staff' : 'कर्मचारी'}
                            </p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle size={14} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {language === 'en' ? 'Resolved' : 'हल किया गया'}
                                    </span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {zone.resolvedIssues}
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle size={14} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {language === 'en' ? 'Total Issues' : 'कुल मुद्दे'}
                                    </span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {zone.totalIssues}
                                </p>
                            </div>
                        </div>

                        {/* Resolution Rate Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {language === 'en' ? 'Resolution Rate' : 'समाधान दर'}
                                </span>
                                <span className={`text-xs font-bold ${getPerformanceColor(zone.resolutionRate)}`}>
                                    {zone.resolutionRate}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${zone.resolutionRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Zone View */}
            {selectedZone && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {selectedZone.zone} - {language === 'en' ? 'Detailed Analytics' : 'विस्तृत विश्लेषण'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {language === 'en' ? 'Comprehensive metrics and performance indicators' : 'व्यापक मेट्रिक्स और प्रदर्शन संकेतक'}
                            </p>
                        </div>
                        <div className={`px-6 py-3 rounded-xl border-2 ${getPerformanceBg(selectedZone.avgScore)}`}>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                                {language === 'en' ? 'Overall Score' : 'समग्र स्कोर'}
                            </p>
                            <p className={`text-3xl font-bold ${getPerformanceColor(selectedZone.avgScore)}`}>
                                {selectedZone.avgScore}%
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                            <BarChart3 size={24} className="text-purple-600 dark:text-purple-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {language === 'en' ? 'Total Wards' : 'कुल वार्ड'}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {selectedZone.wardCount}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                            <Users size={24} className="text-blue-600 dark:text-blue-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {language === 'en' ? 'Active Staff' : 'सक्रिय कर्मचारी'}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {selectedZone.staffCount}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                            <CheckCircle size={24} className="text-green-600 dark:text-green-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {language === 'en' ? 'Issues Resolved' : 'मुद्दे हल किए गए'}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {selectedZone.resolvedIssues}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                            <TrendingUp size={24} className="text-amber-600 dark:text-amber-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {language === 'en' ? 'Resolution Rate' : 'समाधान दर'}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {selectedZone.resolutionRate}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZonePerformanceAnalytics;
