import React, { useState, useEffect } from 'react';
import {
    Users, ArrowRightLeft, DollarSign, ShieldAlert,
    Clock, CheckCircle, XCircle, Filter, Search
} from 'lucide-react';

const ApprovalCenter = ({ language }) => {
    const [approvals, setApprovals] = useState([]);
    const [stats, setStats] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchApprovals();
        fetchStats();
    }, [filterType]);

    const fetchApprovals = async () => {
        setLoading(true);
        try {
            const endpoint = filterType === 'all'
                ? '/commissioner/approvals/pending'
                : `/commissioner/approvals/${filterType}`;

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}${endpoint}`);
            const data = await response.json();

            if (data.success) {
                setApprovals(data.approvals || []);
            }
        } catch (error) {
            console.error('Error fetching approvals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/approvals/stats`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (approval) => {
        setProcessingId(approval._id);
        try {
            const endpoint = `/commissioner/approvals/${approval.approvalType}/${approval._id}/approve`;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    comments: '',
                    commissionerId: 'COMM001' // TODO: Get from session
                })
            });

            const data = await response.json();
            if (data.success) {
                alert(language === 'en' ? 'Approved successfully!' : 'सफलतापूर्वक स्वीकृत!');
                fetchApprovals();
                fetchStats();
            }
        } catch (error) {
            console.error('Error approving:', error);
            alert(language === 'en' ? 'Error approving request' : 'अनुरोध स्वीकृत करने में त्रुटि');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (approval) => {
        const reason = prompt(language === 'en' ? 'Enter rejection reason:' : 'अस्वीकृति का कारण दर्ज करें:');
        if (!reason) return;

        setProcessingId(approval._id);
        try {
            const endpoint = `/commissioner/approvals/${approval.approvalType}/${approval._id}/reject`;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    comments: reason,
                    commissionerId: 'COMM001' // TODO: Get from session
                })
            });

            const data = await response.json();
            if (data.success) {
                alert(language === 'en' ? 'Rejected successfully!' : 'सफलतापूर्वक अस्वीकृत!');
                fetchApprovals();
                fetchStats();
            }
        } catch (error) {
            console.error('Error rejecting:', error);
            alert(language === 'en' ? 'Error rejecting request' : 'अनुरोध अस्वीकार करने में त्रुटि');
        } finally {
            setProcessingId(null);
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            recruitment: Users,
            transfer: ArrowRightLeft,
            budget: DollarSign,
            disciplinary: ShieldAlert
        };
        return icons[type] || Users;
    };

    const getTypeColor = (type) => {
        const colors = {
            recruitment: 'from-blue-500 to-cyan-500',
            transfer: 'from-purple-500 to-pink-500',
            budget: 'from-emerald-500 to-teal-500',
            disciplinary: 'from-red-500 to-orange-500'
        };
        return colors[type] || 'from-gray-500 to-gray-600';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            critical: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
            high: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
            low: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
        };
        return badges[priority] || badges.medium;
    };

    const filterOptions = [
        { value: 'all', label: language === 'en' ? 'All Approvals' : 'सभी अनुमोदन', icon: Filter },
        { value: 'recruitment', label: language === 'en' ? 'Recruitment' : 'भर्ती', icon: Users },
        { value: 'transfers', label: language === 'en' ? 'Transfers' : 'स्थानांतरण', icon: ArrowRightLeft },
        { value: 'budget', label: language === 'en' ? 'Budget' : 'बजट', icon: DollarSign },
        { value: 'disciplinary', label: language === 'en' ? 'Disciplinary' : 'अनुशासनात्मक', icon: ShieldAlert }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Approval Center' : 'अनुमोदन केंद्र'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'Review and process pending approvals' : 'लंबित अनुमोदनों की समीक्षा करें और प्रक्रिया करें'}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3">
                {filterOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setFilterType(option.value)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${filterType === option.value
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500'
                                }`}
                        >
                            <Icon size={18} />
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats && stats.map((stat, idx) => {
                    const TypeIcon = getTypeIcon(stat._id);
                    return (
                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTypeColor(stat._id)} flex items-center justify-center`}>
                                    <TypeIcon size={20} className="text-white" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.pending}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <CheckCircle size={12} className="text-green-500" />
                                <span>{stat.approved} approved</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Approvals List */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : approvals.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {language === 'en' ? 'All Caught Up!' : 'सब पूरा हो गया!'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'No pending approvals at the moment' : 'इस समय कोई लंबित अनुमोदन नहीं'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {approvals.map((approval) => {
                        const TypeIcon = getTypeIcon(approval.approvalType);
                        return (
                            <div
                                key={approval._id}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(approval.approvalType)} flex items-center justify-center flex-shrink-0`}>
                                                <TypeIcon size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {approval.title || `${approval.approvalType.charAt(0).toUpperCase() + approval.approvalType.slice(1)} Request`}
                                                    </h3>
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full ${getPriorityBadge(approval.priority)}`}>
                                                        {approval.priority}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                                    {approval.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        <span>{approval.requestedByName || approval.requestedBy?.employeeName || 'Unknown'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        <span>{new Date(approval.requestDate).toLocaleDateString()}</span>
                                                    </div>
                                                    {approval.zone && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">{approval.zone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReject(approval)}
                                            disabled={processingId === approval._id}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle size={18} />
                                            {language === 'en' ? 'Reject' : 'अस्वीकार'}
                                        </button>
                                        <button
                                            onClick={() => handleApprove(approval)}
                                            disabled={processingId === approval._id}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
                                        >
                                            <CheckCircle size={18} />
                                            {language === 'en' ? 'Approve' : 'स्वीकृत'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApprovalCenter;
