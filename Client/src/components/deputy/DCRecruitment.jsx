import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, FileText, User, Calendar,
    MapPin, Loader, ExternalLink, RefreshCw
} from 'lucide-react';

const DCRecruitment = ({ language, userZone }) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/recruitment/zone/${userZone || 'Rohini Zone'}`);
            const data = await response.json();
            if (data.success) {
                setCandidates(data.candidates);
            }
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [userZone]);

    const handleApprove = async (candidateId) => {
        setProcessingId(candidateId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/recruitment/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId, zone: userZone })
            });
            const data = await response.json();
            if (data.success) {
                // Remove from list or show success state
                setCandidates(prev => prev.map(c =>
                    c._id === candidateId ? { ...c, verificationStatus: 'Approved', assignedWard: data.assignedWard, employeeId: data.employeeId } : c
                ));
            } else {
                alert(data.message || "Failed to approve");
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("Server Error");
        } finally {
            setProcessingId(null);
        }
    };

    const [rejectModal, setRejectModal] = useState({ open: false, candidateId: null });
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const openRejectModal = (id) => {
        setRejectModal({ open: true, candidateId: id });
        setRejectionReason('');
    };

    const confirmReject = async () => {
        if (!rejectionReason.trim()) return alert("Please provide a reason.");
        setIsRejecting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/recruitment/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId: rejectModal.candidateId, reason: rejectionReason })
            });
            const data = await response.json();
            if (data.success) {
                setCandidates(prev => prev.map(c =>
                    c._id === rejectModal.candidateId ? { ...c, verificationStatus: 'Rejected' } : c
                ));
                setRejectModal({ open: false, candidateId: null });
            } else {
                alert(data.message || "Failed to reject");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsRejecting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {language === 'en' ? 'Recruitment Approvals' : 'भर्ती अनुमोदन'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {language === 'en' ? 'Zone:' : 'क्षेत्र:'} {userZone}
                    </p>
                </div>
                <button
                    onClick={fetchCandidates}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {candidates.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <User className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">{language === 'en' ? 'No pending applications' : 'कोई लंबित आवेदन नहीं'}</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {candidates.map((candidate) => (
                        <div
                            key={candidate._id}
                            className={`bg-white dark:bg-[#1a1625] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all ${candidate.verificationStatus === 'Approved' ? 'border-green-500/50 bg-green-50/20' :
                                candidate.verificationStatus === 'Rejected' ? 'border-red-200 opacity-60 bg-gray-50' : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">

                                {/* Info Section */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                                {candidate.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{candidate.fullName}</h3>
                                                <p className="text-sm text-gray-500">{candidate.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.verificationStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                                                candidate.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {candidate.verificationStatus}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FileText size={16} />
                                            <span>Exam: {candidate.examId}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <ExternalLink size={16} />
                                            <a href={candidate.documentDriveLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                                View Documents
                                            </a>
                                        </div>
                                    </div>

                                    {candidate.verificationStatus === 'Approved' && (
                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-500/20 animate-in zoom-in duration-300">
                                            <p className="text-sm text-green-800 dark:text-green-300 font-bold flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                Hired Successfully
                                            </p>
                                            <div className="mt-2 text-sm text-green-700 dark:text-green-400 pl-7">
                                                <p>Employee ID: <span className="font-mono font-bold text-base px-2 py-0.5 bg-green-100 dark:bg-green-800 rounded">{candidate.employeeId}</span></p>
                                                <p className="mt-1">Assigned Ward: <span className="font-semibold">{candidate.assignedWard}</span></p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Section */}
                                {candidate.verificationStatus === 'Submitted' && (
                                    <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                                        <button
                                            onClick={() => handleApprove(candidate._id)}
                                            disabled={processingId === candidate._id}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
                                        >
                                            {processingId === candidate._id ? (
                                                <Loader className="animate-spin" size={18} />
                                            ) : (
                                                <>
                                                    <CheckCircle size={18} />
                                                    {language === 'en' ? 'Approve & Hire' : 'अनुमोदन करें'}
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openRejectModal(candidate._id)}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all"
                                        >
                                            <XCircle size={18} />
                                            {language === 'en' ? 'Return Request' : 'वापस भेजें'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Return Application</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
                            rows="3"
                            placeholder="Reason for rejection (e.g., Documents unclear)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        ></textarea>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setRejectModal({ open: false, candidateId: null })}
                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={isRejecting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                            >
                                {isRejecting && <Loader className="animate-spin" size={16} />}
                                Confirm Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DCRecruitment;
