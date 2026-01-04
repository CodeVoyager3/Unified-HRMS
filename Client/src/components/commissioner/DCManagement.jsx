import React, { useState, useEffect } from 'react';
import { Users, Star, TrendingUp, MapPin } from 'lucide-react';

const DCManagement = ({ language }) => {
    const [dcs, setDcs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDCs();
    }, []);

    const fetchDCs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/deputy-commissioners`);
            const data = await response.json();

            if (data.success) {
                setDcs(data.deputyCommissioners);
            }
        } catch (error) {
            console.error('Error fetching DCs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'en' ? 'Deputy Commissioner Management' : 'उप आयुक्त प्रबंधन'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dcs.map((dc) => (
                    <div key={dc._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                {dc.name?.charAt(0) || 'D'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {dc.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{dc.employeeId}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <MapPin size={14} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dc.zone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <Star size={14} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Score</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {dc.performance?.score || 0}%
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <TrendingUp size={14} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Resolution</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {dc.performance?.resolutionRate || 0}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{dc.performance?.wardsManaged || 0} Wards</span>
                            <span>{dc.performance?.grievancesResolved || 0} Resolved</span>
                        </div>

                        <button className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                            {language === 'en' ? 'View Details' : 'विवरण देखें'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DCManagement;
