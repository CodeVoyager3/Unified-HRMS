
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw, Filter, Bug, Send, X, ArrowRight } from 'lucide-react';

const SIIssueTracker = ({ language = 'en', currentUser }) => {
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Forwarding Modal State
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [forwardDept, setForwardDept] = useState('Engineering');
    const [isForwarding, setIsForwarding] = useState(false);

    const departments = [
        'Engineering', 'Health', 'Electrical', 'Horticulture', 'Water Works'
    ];

    const fetchIssues = async () => {
        if (!currentUser?.Ward) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue/ward/${currentUser.Ward}`);
            const data = await response.json();
            if (data.success) {
                setIssues(data.issues);
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [currentUser]);

    const handleResolve = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue/resolve/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resolvedBy: 'Inspector', resolutionImage: '' })
            });
            if (response.ok) {
                fetchIssues();
            }
        } catch (error) {
            console.error("Error resolving issue:", error);
        }
    };

    const openForwardModal = (issue) => {
        setSelectedIssue(issue);
        setShowForwardModal(true);
    };

    const handleForwardSubmmit = async () => {
        if (!selectedIssue) return;
        setIsForwarding(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue/forward/${selectedIssue._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ department: forwardDept })
            });

            if (response.ok) {
                setShowForwardModal(false);
                fetchIssues();
            }
        } catch (error) {
            console.error("Error forwarding issue:", error);
        } finally {
            setIsForwarding(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'Forwarded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.Description.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (filter === 'Vector Control') {
            matchesFilter = issue.category === 'Vector Control';
        } else if (filter !== 'All') {
            matchesFilter = issue.Status === filter;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {language === 'en' ? 'Issue Tracker' : 'मुद्दा ट्रैकर'}
                        {loading && <RefreshCw className="animate-spin text-gray-400" size={16} />}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {language === 'en' ? 'Manage, resolve, and forward field issues' : 'क्षेत्रीय मुद्दों का प्रबंधन, समाधान और अग्रेषण करें'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['All', 'Pending', 'In Progress', 'Resolved', 'Forwarded', 'Vector Control'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 ${filter === tab
                                ? tab === 'Vector Control'
                                    ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800'
                                    : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            {tab === 'Vector Control' && <Bug size={12} />}
                            {tab}
                        </button>
                    ))}
                    <button onClick={fetchIssues} className="p-2 ml-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Content List */}
            {loading && issues.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Loading issues...</div>
            ) : filteredIssues.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <CheckCircle size={32} />
                    </div>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No issues found</p>
                    <p className="text-sm text-gray-400">Try adjusting filters or check back later</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.map(issue => (
                        <div key={issue._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2 flex-wrap">
                                    {issue.category === 'Vector Control' && (
                                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                                            <Bug size={12} /> Vector
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles(issue.Status)}`}>
                                        {issue.Status}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap ml-2">
                                    {new Date(issue.Date).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1 text-base">{issue.Title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
                                {issue.Description}
                            </p>

                            {issue.Status === 'Forwarded' && (
                                <div className="mb-4 text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                    <Send size={12} />
                                    Forwarded to <span className="font-bold">{issue.department}</span> Department
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    Reported by: <span className="font-medium text-gray-700 dark:text-gray-300">{issue.Eid}</span>
                                </span>
                            </div>

                            {/* Actions Overlay */}
                            <div className="mt-4 flex gap-2">
                                {issue.Status === 'Pending' || issue.Status === 'In Progress' ? (
                                    <>
                                        <button
                                            onClick={() => openForwardModal(issue)}
                                            className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Send size={14} /> Forward
                                        </button>
                                        <button
                                            onClick={() => handleResolve(issue._id)}
                                            className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Resolve
                                        </button>
                                    </>
                                ) : issue.Status === 'Resolved' ? (
                                    <div className="w-full py-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-xl text-xs font-bold text-center border border-green-100 dark:border-green-800 flex items-center justify-center gap-1">
                                        <CheckCircle size={14} /> Case Closed
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Forward Modal */}
            {showForwardModal && selectedIssue && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden scale-100">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Forward Issue</h3>
                            <button onClick={() => setShowForwardModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-1">Issue</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{selectedIssue.Title}</p>
                            </div>

                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Select Department</label>
                            <div className="space-y-2">
                                {departments.map(dept => (
                                    <label key={dept} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${forwardDept === dept ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}>
                                        <input
                                            type="radio"
                                            name="department"
                                            value={dept}
                                            checked={forwardDept === dept}
                                            onChange={(e) => setForwardDept(e.target.value)}
                                            className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">{dept}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
                            <button
                                onClick={() => setShowForwardModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleForwardSubmmit}
                                disabled={isForwarding}
                                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {isForwarding ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
                                Forward Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SIIssueTracker;
