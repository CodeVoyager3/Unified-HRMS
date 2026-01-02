import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, MapPin, AlertCircle } from 'lucide-react';
import { zonePerformanceData, getZoneColor, getTrendDisplay } from '../../data/zoneData';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';


const DelhiZoneMap = ({ language = 'en' }) => {
    const [selectedZone, setSelectedZone] = useState(null);

    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setSelectedZone(data.activePayload[0].payload);
        }
    };

    const closeModal = () => {
        setSelectedZone(null);
    };

    const TrendIcon = ({ trend }) => {
        const trendInfo = getTrendDisplay(trend);
        if (trend === 'up') return <TrendingUp size={16} style={{ color: trendInfo.color }} />;
        if (trend === 'down') return <TrendingDown size={16} style={{ color: trendInfo.color }} />;
        return <Minus size={16} style={{ color: trendInfo.color }} />;
    };

    // Custom Tooltip for Bar Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-purple-400" />
                        <p className="font-semibold text-sm">
                            {language === 'en' ? data.zone_name : data.zone_name_hi}
                        </p>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">{language === 'en' ? 'Performance:' : 'प्रदर्शन:'}</span>
                            <span className="font-medium" style={{ color: getZoneColor(data.performance_score) }}>
                                {data.performance_score}%
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">{language === 'en' ? 'Resolved:' : 'हल किया गया:'}</span>
                            <span className="font-medium text-green-400">{data.complaints_resolved}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">{language === 'en' ? 'Trend:' : 'रुझान:'}</span>
                            <span className="font-medium capitalize">{data.trend}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative w-full">
            {/* Chart Container */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={zonePerformanceData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        onClick={handleBarClick}
                        className="cursor-pointer"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                        <XAxis
                            dataKey="zone_id"
                            tickFormatter={(value) => value.replace('zone_', 'Z')}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar
                            dataKey="performance_score"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                            animationDuration={1500}
                        >
                            {zonePerformanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getZoneColor(entry.performance_score)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <div className="flex justify-center mt-2">
                    <p className="text-xs text-gray-500 italic">
                        {language === 'en' ? '* Click bars for details' : '* विवरण के लिए बार पर क्लिक करें'}
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#6F42C1]"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Excellent (75-100)' : 'उत्कृष्ट (75-100)'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#A074F0]"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Average (50-74)' : 'औसत (50-74)'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#D8B4FE]"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Needs Attention (<50)' : 'ध्यान आवश्यक (<50)'}
                    </span>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            className="p-4 text-white"
                            style={{ backgroundColor: getZoneColor(selectedZone.performance_score) }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin size={24} />
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {language === 'en' ? selectedZone.zone_name : selectedZone.zone_name_hi}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {language === 'en' ? 'Zone Performance Details' : 'जोन प्रदर्शन विवरण'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-4xl font-bold">{selectedZone.performance_score}%</span>
                                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                                    <TrendIcon trend={selectedZone.trend} />
                                    <span className="text-xs font-medium">
                                        {getTrendDisplay(selectedZone.trend).label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 space-y-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Sanitation Score' : 'स्वच्छता स्कोर'}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedZone.sanitation_score}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Revenue Collected' : 'राजस्व एकत्रित'}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        ₹{selectedZone.revenue_collected}Cr
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Complaints Resolved' : 'शिकायतें निपटाई'}
                                    </p>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {selectedZone.complaints_resolved}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Complaints Pending' : 'शिकायतें लंबित'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                            {selectedZone.complaints_pending}
                                        </p>
                                        {selectedZone.complaints_pending > 100 && (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {language === 'en' ? 'Overall Performance' : 'समग्र प्रदर्शन'}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {selectedZone.performance_score}%
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${selectedZone.performance_score}%`,
                                            backgroundColor: getZoneColor(selectedZone.performance_score)
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-3 bg-[#6F42C1] hover:bg-[#5a35a0] text-white font-medium rounded-xl transition-colors">
                                {language === 'en' ? 'View Full Zone Report' : 'पूर्ण जोन रिपोर्ट देखें'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DelhiZoneMap;
