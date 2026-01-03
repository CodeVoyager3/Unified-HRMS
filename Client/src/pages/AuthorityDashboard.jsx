import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AuthorityDashboard = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/verification/cases');
            const data = await res.json();
            if (data.success) {
                setCases(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (caseId, action) => {
        const comments = prompt("Enter comments:");
        if (comments === null) return;

        try {
            const res = await fetch('http://localhost:3000/api/verification/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId,
                    action,
                    comments,
                    authorityId: 'AUTH_001' // Mock ID
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                fetchCases(); // Refresh
            }
        } catch (error) {
            alert("Action failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-[#6F42C1]">Authority Review Dashboard</h1>

                {loading ? <p>Loading cases...</p> : (
                    <div className="grid gap-6">
                        {cases.length === 0 ? <p className="text-gray-500">No pending cases.</p> : cases.map(reviewCase => (
                            <div key={reviewCase._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{reviewCase.candidateId.fullName}</h3>
                                        <p className="text-sm text-gray-500">{reviewCase.candidateId.email} • {reviewCase.candidateId.examId}</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                                        {reviewCase.status}
                                    </span>
                                </div>

                                <div className="mb-4 space-y-2 text-sm">
                                    <p><strong>Enrollment:</strong> {reviewCase.candidateId.enrollmentNumber}</p>
                                    <p><strong>AI Match Confidence:</strong> {reviewCase.candidateId.aiVerificationData?.matchConfidence}%</p>
                                    <p><strong>Drive Link:</strong> <a href={reviewCase.candidateId.documentDriveLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open Documents</a></p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(reviewCase._id, 'Accepted')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                                    >
                                        Approve & Onboard
                                    </button>
                                    <button
                                        onClick={() => handleAction(reviewCase._id, 'Rejected')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorityDashboard;
