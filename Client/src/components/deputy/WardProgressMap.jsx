import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Minus, MapPin, AlertCircle, Info } from 'lucide-react';
import { wardData, getWardColor } from '../../data/wardData';
import { getTrendDisplay } from '../../data/zoneData';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const WardProgressMap = ({ language = 'en', userZone = 'Rohini Zone' }) => {
    const [selectedWard, setSelectedWard] = useState(null);
    const [filteredWards, setFilteredWards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Don't fetch if userZone is null
        if (!userZone) return;

        // Fetch wards from database based on DC's zone
        const fetchWards = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/deputy/wards/${userZone}`);
                const data = await response.json();
                if (data.success) {
                    const wardsWithPerformance = data.wards.map(ward => ({
                        id: parseInt(ward.wardNumber),
                        name: ward.wardName,
                        zone: ward.zoneName,
                        lat: ward.latitude,
                        lng: ward.longitude,
                        // Data from Real API
                        score: ward.score,
                        sanitation: ward.sanitation,
                        resolved: ward.resolved,
                        pending: ward.pending,
                        trend: ward.trend
                    }));
                    setFilteredWards(wardsWithPerformance);
                }
            } catch (error) {
                console.error('Error fetching wards:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWards();
    }, [userZone]);

    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setSelectedWard(data.activePayload[0].payload);
        }
    };

    const closeModal = () => {
        setSelectedWard(null);
    };

    const TrendIcon = ({ trend }) => {
        const trendInfo = getTrendDisplay(trend);
        if (trend === 'up') return <TrendingUp size={16} style={{ color: trendInfo.color }} />;
        if (trend === 'down') return <TrendingDown size={16} style={{ color: trendInfo.color }} />;
        return <Minus size={16} style={{ color: trendInfo.color }} />;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-purple-400" />
                        <p className="font-semibold text-sm">{data.name}</p>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">{language === 'en' ? 'Performance:' : 'प्रदर्शन:'}</span>
                            <span className="font-medium" style={{ color: getWardColor(data.score) }}>
                                {data.score}%
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">{language === 'en' ? 'Resolved:' : 'हल किया गया:'}</span>
                            <span className="font-medium text-green-400">{data.resolved}%</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative w-full">
            <div className="mb-4 flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl">
                <Info size={18} className="text-purple-600 dark:text-purple-400" />
                <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                    {language === 'en'
                        ? `Displaying ${filteredWards.length} Wards for ${userZone}`
                        : `${userZone} के लिए ${filteredWards.length} वार्ड प्रदर्शित कर रहे हैं`}
                </p>
            </div>

            {/* Chart Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={filteredWards}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        onClick={handleBarClick}
                        className="cursor-pointer"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar
                            dataKey="score"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                            animationDuration={1500}
                        >
                            {filteredWards.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getWardColor(entry.score)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#6F42C1]"></div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Excellent (75+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A074F0]"></div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Good (50-74)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D8B4FE]"></div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">At Risk (&lt;50)</span>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedWard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            className="p-6 text-white"
                            style={{ backgroundColor: getWardColor(selectedWard.score) }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedWard.name}</h3>
                                        <p className="text-sm opacity-90">{selectedWard.zone}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-bold">{selectedWard.score}%</span>
                                <div className="mb-1 flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                                    <TrendIcon trend={selectedWard.trend} />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {getTrendDisplay(selectedWard.trend).label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sanitation Score</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedWard.sanitation}%</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Complaints Resolved</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedWard.resolved}%</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Grievance Backlog</span>
                                    <span className="text-sm font-bold text-amber-600">{selectedWard.pending} cases</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${Math.min(100, (selectedWard.pending / 150) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-[#6F42C1] hover:bg-[#5a35a0] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 active:scale-95">
                                {language === 'en' ? 'Deploy Inspector Team' : 'निरीक्षक टीम तैनात करें'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardProgressMap;
