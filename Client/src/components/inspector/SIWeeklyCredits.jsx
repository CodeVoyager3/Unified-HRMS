import React, { useState, useEffect } from 'react';
import { Star, Search, Users, Trophy, Award, AlertTriangle, Loader, CheckCircle } from 'lucide-react';

const SIWeeklyCredits = ({ language = 'en', currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [creditValue, setCreditValue] = useState(7);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [wardNumber, setWardNumber] = useState(42);
    const [activeWeek, setActiveWeek] = useState(1);
    const [assignedCredits, setAssignedCredits] = useState({}); // {employeeId: {week1: 8, week2: 9, ...}}
    const [isAssigning, setIsAssigning] = useState(false);
    const [isBulkAssigning, setIsBulkAssigning] = useState(false);
    const [assignedBy, setAssignedBy] = useState('');

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get current week of month (1-4)
    const getCurrentWeek = () => {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - firstDay) / (1000 * 60 * 60 * 24));
        return Math.min(4, Math.max(1, Math.ceil((daysPassed + 1) / 7)));
    };

    // Fetch employees from ward
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                let currentWard = 42;

                if (currentUser?.Ward) {
                    currentWard = parseInt(currentUser.Ward);
                    setWardNumber(currentWard);
                    setAssignedBy(currentUser.employeeId);
                } else {
                    const storedData = localStorage.getItem('verifiedUser');
                    if (storedData) {
                        try {
                            const userData = JSON.parse(storedData);
                            if (userData.Ward !== undefined && userData.Ward !== null) {
                                currentWard = parseInt(userData.Ward);
                                setWardNumber(currentWard);
                            }
                            if (userData.employeeId) {
                                setAssignedBy(userData.employeeId);
                            }
                        } catch (parseError) {
                            console.error('[Credit System] Error parsing localStorage:', parseError);
                        }
                    }
                }

                console.log('[Credit System] Fetching employees for ward:', currentWard);

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URI}/credit/employees/${currentWard}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('[Credit System] API Response:', data);

                if (data.success) {
                    const empList = data.employees || [];
                    setEmployees(empList);
                    console.log(`[Credit System] Successfully loaded ${empList.length} employees for ward ${currentWard}`);

                    if (empList.length === 0) {
                        console.warn(`[Credit System] No employees found for ward ${currentWard}. Please check if employees are assigned to this ward in the database.`);
                    }
                } else {
                    console.error('[Credit System] API returned error:', data.message);
                    setEmployees([]);
                }

                // Fetch existing credits
                await fetchCredits(currentWard);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setEmployees([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
        setActiveWeek(getCurrentWeek());
    }, []); // Run only once on mount

    // Fetch credits for all employees
    const fetchCredits = async (ward) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URI}/credit/ward/${ward}?month=${currentMonth}&year=${currentYear}`
            );
            const data = await response.json();
            if (data.success && data.credits) {
                const creditMap = {};
                data.credits.forEach(credit => {
                    creditMap[credit.employeeId] = {
                        week1: credit.week1 || 0,
                        week2: credit.week2 || 0,
                        week3: credit.week3 || 0,
                        week4: credit.week4 || 0
                    };
                });
                setAssignedCredits(creditMap);
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    // Refresh employees list
    const refreshEmployees = async () => {
        setIsLoading(true);
        try {
            // Get ward from localStorage or use current state
            let currentWard = wardNumber;
            const storedData = localStorage.getItem('verifiedUser');
            if (storedData) {
                try {
                    const userData = JSON.parse(storedData);
                    if (userData.Ward !== undefined && userData.Ward !== null) {
                        currentWard = parseInt(userData.Ward);
                        setWardNumber(currentWard);
                    }
                } catch (parseError) {
                    console.error('Error parsing localStorage on refresh:', parseError);
                }
            }

            console.log('[Credit System] Refreshing employees for ward:', currentWard);

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URI}/credit/employees/${currentWard}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Credit System] Refresh HTTP error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Credit System] Refresh API Response:', data);

            if (data.success) {
                const empList = data.employees || [];
                setEmployees(empList);
                console.log(`[Credit System] Refreshed: ${empList.length} employees loaded`);
                await fetchCredits(currentWard);
            } else {
                console.error('[Credit System] Refresh failed:', data.message);
            }
        } catch (error) {
            console.error('[Credit System] Error refreshing employees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle individual credit assignment
    const handleAssignCredit = async (employeeId) => {
        if (!assignedBy) {
            alert(language === 'en' ? 'Please login to assign credits' : 'क्रेडिट असाइन करने के लिए कृपया लॉगिन करें');
            return;
        }

        setIsAssigning(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/credit/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId,
                    wardNumber,
                    week: activeWeek,
                    month: currentMonth,
                    year: currentYear,
                    credit: parseInt(creditValue),
                    assignedBy
                })
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setAssignedCredits(prev => ({
                    ...prev,
                    [employeeId]: {
                        ...prev[employeeId],
                        [`week${activeWeek}`]: parseInt(creditValue)
                    }
                }));
                alert(language === 'en' ? 'Credit assigned successfully!' : 'क्रेडिट सफलतापूर्वक असाइन किया गया!');
            } else {
                alert(data.message || (language === 'en' ? 'Failed to assign credit' : 'क्रेडिट असाइन करने में विफल'));
            }
        } catch (error) {
            console.error('Error assigning credit:', error);
            alert(language === 'en' ? 'Error assigning credit' : 'क्रेडिट असाइन करने में त्रुटि');
        } finally {
            setIsAssigning(false);
        }
    };

    // Handle bulk credit assignment
    const handleBulkAssign = async () => {
        if (!assignedBy) {
            alert(language === 'en' ? 'Please login to assign credits' : 'क्रेडिट असाइन करने के लिए कृपया लॉगिन करें');
            return;
        }

        if (!confirm(language === 'en'
            ? `Assign credit ${creditValue} to all remaining employees for Week ${activeWeek}? This action cannot be undone.`
            : `सप्ताह ${activeWeek} के लिए सभी शेष कर्मचारियों को क्रेडिट ${creditValue} असाइन करें? यह कार्रवाई पूर्ववत नहीं की जा सकती।`)) {
            return;
        }

        setIsBulkAssigning(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/credit/bulk-assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wardNumber,
                    week: activeWeek,
                    month: currentMonth,
                    year: currentYear,
                    credit: parseInt(creditValue),
                    assignedBy
                })
            });

            const data = await response.json();
            if (data.success) {
                alert(language === 'en'
                    ? `Credits assigned to ${data.assignedCount} employees!`
                    : `${data.assignedCount} कर्मचारियों को क्रेडिट असाइन किए गए!`);
                // Refresh credits
                await fetchCredits(wardNumber);
            } else {
                alert(data.message || (language === 'en' ? 'Failed to assign credits' : 'क्रेडिट असाइन करने में विफल'));
            }
        } catch (error) {
            console.error('Error bulk assigning credits:', error);
            alert(language === 'en' ? 'Error assigning credits' : 'क्रेडिट असाइन करने में त्रुटि');
        } finally {
            setIsBulkAssigning(false);
        }
    };

    // Filter employees based on search
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get employees who have credit for current week
    const employeesWithCredit = filteredEmployees.filter(emp => {
        const credits = assignedCredits[emp.employeeId];
        return credits && credits[`week${activeWeek}`] > 0;
    });

    // Get employees without credit for current week
    const employeesWithoutCredit = filteredEmployees.filter(emp => {
        const credits = assignedCredits[emp.employeeId];
        return !credits || credits[`week${activeWeek}`] === 0;
    });

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            {language === 'en' ? 'Weekly Credit System' : 'साप्ताहिक क्रेडिट सिस्टम'}
                        </h2>
                        <p className="text-orange-50 text-sm max-w-lg">
                            {language === 'en'
                                ? 'Award performance credits (0-10) to motivate staff. Credits can be assigned once per week.'
                                : 'कर्मचारियों को प्रेरित करने के लिए प्रदर्शन क्रेडिट (0-10) प्रदान करें। क्रेडिट सप्ताह में एक बार दिए जा सकते हैं।'}
                        </p>
                    </div>
                    <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <p className="text-xs uppercase tracking-widest font-bold opacity-80">
                            {language === 'en' ? 'Current Cycle' : 'वर्तमान चक्र'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                value={activeWeek}
                                onChange={(e) => setActiveWeek(parseInt(e.target.value))}
                                className="bg-white/20 text-white font-bold text-2xl rounded-lg px-3 py-1 border border-white/30 outline-none cursor-pointer"
                            >
                                {[1, 2, 3, 4].map(w => (
                                    <option key={w} value={w} className="bg-amber-600">
                                        {language === 'en' ? `Week ${w}` : `सप्ताह ${w}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Manual Assignment */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Trophy className="text-amber-500" size={20} />
                            {language === 'en' ? 'Credit Assignment' : 'क्रेडिट असाइनमेंट'}
                        </h3>
                        <button
                            onClick={refreshEmployees}
                            disabled={isLoading}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" size={14} />
                            ) : (
                                <span>{language === 'en' ? 'Refresh' : 'रीफ्रेश'}</span>
                            )}
                        </button>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={language === 'en' ? 'Search by ID or Name...' : 'आईडी या नाम से खोजें...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 border border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500">
                                {language === 'en' ? 'Credit:' : 'क्रेडिट:'}
                            </span>
                            <select
                                className="bg-transparent font-bold text-gray-800 dark:text-white outline-none"
                                value={creditValue}
                                onChange={(e) => setCreditValue(e.target.value)}
                            >
                                {[...Array(11).keys()].map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="animate-spin text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-500">
                                {language === 'en' ? 'Loading employees...' : 'कर्मचारी लोड हो रहे हैं...'}
                            </p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                {language === 'en'
                                    ? `No employees found for Ward ${wardNumber}`
                                    : `वार्ड ${wardNumber} के लिए कोई कर्मचारी नहीं मिला`}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                                {language === 'en'
                                    ? 'Make sure employees are assigned to this ward in the database'
                                    : 'सुनिश्चित करें कि कर्मचारी डेटाबेस में इस वार्ड को असाइन किए गए हैं'}
                            </p>
                            <button
                                onClick={refreshEmployees}
                                className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 underline"
                            >
                                {language === 'en' ? 'Refresh' : 'रीफ्रेश'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {language === 'en' ? 'Employees' : 'कर्मचारी'} ({filteredEmployees.length})
                            </p>

                            {/* Employees without credit for this week */}
                            {employeesWithoutCredit.map(emp => {
                                const credits = assignedCredits[emp.employeeId] || {};
                                return (
                                    <div key={emp.employeeId} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold text-xs">
                                                {emp.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-gray-800 dark:text-white">{emp.name}</p>
                                                <p className="text-xs text-gray-500">{emp.employeeId} • {emp.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Week credits display */}
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map(w => (
                                                    <div key={w} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${w === activeWeek ? 'bg-amber-500 text-white' :
                                                            credits[`week${w}`] > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                                'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                                        }`}>
                                                        {credits[`week${w}`] || 0}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleAssignCredit(emp.employeeId)}
                                                disabled={isAssigning}
                                                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
                                            >
                                                {isAssigning ? (
                                                    <Loader className="animate-spin" size={16} />
                                                ) : (
                                                    language === 'en' ? 'Assign' : 'असाइन करें'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Employees with credit for this week */}
                            {employeesWithCredit.length > 0 && (
                                <>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">
                                        {language === 'en' ? 'Already Assigned' : 'पहले से असाइन किया गया'}
                                    </p>
                                    {employeesWithCredit.map(emp => {
                                        const credits = assignedCredits[emp.employeeId] || {};
                                        return (
                                            <div key={emp.employeeId} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center font-bold text-xs">
                                                        {emp.name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm text-gray-800 dark:text-white">{emp.name}</p>
                                                        <p className="text-xs text-gray-500">{emp.employeeId} • {emp.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4].map(w => (
                                                            <div key={w} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${w === activeWeek ? 'bg-amber-500 text-white' :
                                                                    credits[`week${w}`] > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                                        'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                                                }`}>
                                                                {credits[`week${w}`] || 0}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star size={14} className="fill-amber-400 text-amber-400" />
                                                        <span className="font-bold text-gray-800 dark:text-white">
                                                            {credits[`week${activeWeek}`]}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Bulk Action */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Users size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {language === 'en' ? 'Bulk Credit' : 'बल्क क्रेडिट'}
                        </h3>
                        <p className="text-indigo-200 text-sm mb-6">
                            {language === 'en'
                                ? `Assign standard credits to all remaining employees who haven't received a score for Week ${activeWeek}.`
                                : `सप्ताह ${activeWeek} के लिए सभी शेष कर्मचारियों को मानक क्रेडिट असाइन करें जिन्हें अभी तक स्कोर नहीं मिला है।`}
                        </p>

                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10 mb-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-indigo-200">
                                    {language === 'en' ? 'Standard Credit' : 'मानक क्रेडिट'}
                                </span>
                                <span className="font-bold text-white text-lg">{creditValue}</span>
                            </div>
                            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(creditValue / 10) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-3 mb-4 backdrop-blur-md border border-white/10">
                            <p className="text-xs text-indigo-200 mb-1">
                                {language === 'en' ? 'Remaining Employees' : 'शेष कर्मचारी'}
                            </p>
                            <p className="text-2xl font-bold">{employeesWithoutCredit.length}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleBulkAssign}
                        disabled={isBulkAssigning || employeesWithoutCredit.length === 0}
                        className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isBulkAssigning ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                {language === 'en' ? 'Assigning...' : 'असाइन हो रहा है...'}
                            </>
                        ) : (
                            <>
                                <Award size={18} />
                                {language === 'en' ? 'Apply to All Remaining' : 'सभी शेष को लागू करें'}
                            </>
                        )}
                    </button>

                    <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300 justify-center">
                        <AlertTriangle size={12} />
                        <span>
                            {language === 'en'
                                ? `Action cannot be undone for Week ${activeWeek}`
                                : `सप्ताह ${activeWeek} के लिए कार्रवाई पूर्ववत नहीं की जा सकती`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SIWeeklyCredits;
