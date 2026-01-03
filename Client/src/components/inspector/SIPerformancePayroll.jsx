
import React, { useState, useEffect } from 'react';
import { User, FileText, ChevronRight, X, Mail, Phone, DollarSign, Loader, RefreshCw } from 'lucide-react';

const SIPerformancePayroll = ({ language = 'en', currentUser }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWardPayroll = async () => {
        if (!currentUser?.Ward) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/payroll/ward/${currentUser.Ward}`);
            const data = await response.json();
            if (data.success) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error("Error fetching ward payroll:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWardPayroll();
    }, [currentUser]);

    const getPerformanceColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-purple-600';
        return 'text-amber-600';
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* List View */}
            <div className={`${selectedEmployee ? 'hidden lg:flex w-full lg:w-1/2' : 'w-full'} flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {language === 'en' ? 'Employee Performance' : 'कर्मचारी प्रदर्शन'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {language === 'en' ? 'Click on an employee to view pay slip' : 'वेतन पर्ची देखने के लिए कर्मचारी पर क्लिक करें'}
                        </p>
                    </div>
                    <button onClick={fetchWardPayroll} disabled={loading} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <Loader className="animate-spin text-purple-600 mb-2" />
                            <p className="text-xs text-gray-400">Loading payroll data...</p>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40">
                            <p className="text-gray-400 text-sm">No employees found.</p>
                        </div>
                    ) : (
                        employees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => setSelectedEmployee(emp)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-purple-50 dark:hover:bg-purple-900/10 ${selectedEmployee?.id === emp.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm">
                                            {emp.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-white text-sm">{emp.name}</h3>
                                            <p className="text-xs text-gray-500">{emp.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-lg font-bold ${getPerformanceColor(emp.performance)}`}>{emp.performance}%</span>
                                        <p className="text-[10px] text-gray-400">{language === 'en' ? 'Score' : 'स्कोर'}</p>
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>

            {/* Detail View */}
            <div className={`${!selectedEmployee ? 'hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center' : 'w-full lg:w-1/2'} flex-col`}>
                {selectedEmployee ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-[#6F42C1] to-[#5a35a0] text-white relative">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white text-[#6F42C1] flex items-center justify-center text-2xl font-bold border-4 border-white/30">
                                    {selectedEmployee.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                                    <div className="flex items-center gap-2 text-purple-100 text-sm opacity-90">
                                        <span>{selectedEmployee.id}</span>
                                        <span>•</span>
                                        <span>{selectedEmployee.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            {/* Contact Info */}
                            <div className="flex gap-4">
                                <a href={`tel:${selectedEmployee.phone}`} className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Phone size={16} /> Call
                                </a>
                                <a href="#" className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Mail size={16} /> Message
                                </a>
                            </div>

                            {/* Payroll Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Base Salary</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{selectedEmployee.baseSalary}</p>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Attendance</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedEmployee.attendance}</p>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <DollarSign size={18} className="text-emerald-500" />
                                        Payroll Breakdown
                                    </h4>
                                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                                        {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Basic Pay</span>
                                        <span className="font-medium">₹{selectedEmployee.baseSalary}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Benefits & Allowances</span>
                                        <span className="font-medium text-green-600">Included</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Overtime ({selectedEmployee.overtime})</span>
                                        <span className="font-medium text-green-600">+ ₹0</span>
                                    </div>
                                    <div className="h-px bg-gray-300 dark:bg-gray-700 my-2"></div>
                                    <div className="flex justify-between text-base font-bold">
                                        <span>Total Net Pay</span>
                                        <span>₹{selectedEmployee.salary}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    <FileText size={16} /> Download Slip
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <User size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Employee Selected</h3>
                        <p className="text-sm text-gray-500 max-w-xs">Select an employee from the list to view their detailed performance report and payroll information.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SIPerformancePayroll;
