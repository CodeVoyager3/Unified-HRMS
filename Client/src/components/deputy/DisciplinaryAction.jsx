import React, { useState } from 'react';
import { ShieldAlert, UserX, UserCheck, Search, Filter, AlertTriangle } from 'lucide-react';

const DisciplinaryAction = ({ language = 'en', userZone }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    // Mock data - In real app, fetch from backend using userZone
    const allEmployees = [
        { id: 'MCD101', name: 'Rajesh Kumar', ward: 'ROHINI-A', zone: 'Rohini Zone', performance: 45, status: 'Active', lateDays: 12 },
        { id: 'MCD105', name: 'Sunita Sharma', ward: 'ROHINI-B', zone: 'Rohini Zone', performance: 38, status: 'Active', lateDays: 15 },
        { id: 'MCD120', name: 'Amit Singh', ward: 'RITHALA', zone: 'Rohini Zone', performance: 52, status: 'Under Review', lateDays: 8 },
        { id: 'MCD142', name: 'Priya Devi', ward: 'VIJAY VIHAR', zone: 'Rohini Zone', performance: 30, status: 'Active', lateDays: 20 },
        { id: 'MCD201', name: 'Vikram Malhotra', ward: 'KAROL BAGH-A', zone: 'Karol Bagh Zone', performance: 40, status: 'Active', lateDays: 10 },
    ];

    const employees = allEmployees.filter(emp => emp.zone === userZone);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {language === 'en' ? 'Disciplinary Actions' : 'अनुशासनात्मक कार्रवाई'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Manage underperforming employees and take necessary actions' : 'कम प्रदर्शन करने वाले कर्मचारियों को प्रबंधित करें और आवश्यक कार्रवाई करें'}
                    </p>
                </div>
                <div className="flex bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 gap-3">
                    <ShieldAlert className="text-amber-600 dark:text-amber-400" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            {language === 'en' ? '4 Underperforming Employees' : '4 कम प्रदर्शन करने वाले कर्मचारी'}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                            {language === 'en' ? 'Performance score below 50%' : 'प्रदर्शन स्कोर 50% से नीचे'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={language === 'en' ? "Search by name or ID..." : "नाम या आईडी से खोजें..."}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter size={18} />
                        <span>{language === 'en' ? 'Filter' : 'फ़िल्टर'}</span>
                    </button>
                </div>
            </div>

            {/* Employee List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                    {emp.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">{emp.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{emp.id} • {emp.ward}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${emp.performance < 40 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                {language === 'en' ? 'Score:' : 'स्कोर:'} {emp.performance}%
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{language === 'en' ? 'Attendance' : 'उपस्थिति'}</p>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-amber-500" />
                                    <p className="text-sm font-semibold">{emp.lateDays} {language === 'en' ? 'Late Days' : 'देरी के दिन'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{language === 'en' ? 'Status' : 'स्थिति'}</p>
                                <p className="text-sm font-semibold">{emp.status}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">
                                <ShieldAlert size={16} />
                                {language === 'en' ? 'Issue Warning' : 'चेतावनी जारी करें'}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                                <UserX size={16} />
                                {language === 'en' ? 'Suspend' : 'निलंबित करें'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisciplinaryAction;
