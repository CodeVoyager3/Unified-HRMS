import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecruitmentSearch from '../components/PublicCorner/RecruitmentSearch';
import DocumentUpload from '../components/PublicCorner/DocumentUpload';
import { FileCheck, UserCheck, ShieldCheck, Clock, CheckCircle, Info, ChevronRight } from 'lucide-react';

const RecruitmentPage = () => {
    const [candidateData, setCandidateData] = useState(null);
    const [viewState, setViewState] = useState('SEARCH'); // SEARCH, RESULT

    const handleSearch = async (examId, enrollmentNumber, dob) => {
        try {
            const res = await fetch('http://localhost:3000/api/recruitment/check-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ examId, enrollmentNumber, dob })
            });
            const data = await res.json();

            if (data.success) {
                setCandidateData(data.candidate);
                setViewState('RESULT');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Search Error:", error);
            alert("Failed to check status. System Error.");
        }
    };

    const handleSubmitComplete = () => {
        setCandidateData(prev => ({ ...prev, verificationStatus: 'Submitted' }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans flex flex-col">
            <Navbar />

            {/* Hero Section with Purple Gradient */}
            <section className="relative bg-gradient-to-br from-[#6F42C1] via-[#7c4dce] to-[#8b5cf6] dark:from-[#5a32a3] dark:via-[#6639b5] dark:to-[#7c4dce] text-white py-12 md:py-16 overflow-hidden shadow-lg mb-8">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                    {/* Breadcrumb */}
                    <nav className="text-sm mb-6 opacity-80" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><a href="/" className="hover:underline">Home</a></li>
                            <li>/</li>
                            <li className="font-medium">Recruitment Portal</li>
                        </ol>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                                Official Recruitment Portal
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl">
                                Verify candidacy, submit documents, and track application status securely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 w-full">
                {viewState === 'SEARCH' && (
                    <div className="animate-in fade-in zoom-in duration-500">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                            {/* Left Column: Instructions & Info */}
                            <div className="space-y-8 order-2 lg:order-1 pt-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#6F42C1] dark:text-[#a074f0] mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" />
                                        Instructions for Candidates
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                        Welcome to the official recruitment status portal. Please follow the steps below to verify your identity and complete your document submission process.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[#6F42C1] dark:text-purple-300 font-bold">1</div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Check Eligibility Status</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Select your active examination and enter your Enrollment Number & Date of Birth to check your qualification status.</p>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[#6F42C1] dark:text-purple-300 font-bold">2</div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Secure Document Submission</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">If qualified, you will be prompted to submit your original document scans via a secure Google Drive link.</p>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[#6F42C1] dark:text-purple-300 font-bold">3</div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Await Final Confirmation</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Once submitted, the Recruitment Board will review your application. You will receive an email notification upon approval.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <strong>Note:</strong> Ensure your Date of Birth matches your 10th Standard Certificate. Discrepancies may lead to disqualification.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Search Form */}
                            <div className="order-1 lg:order-2">
                                <RecruitmentSearch onSearch={handleSearch} />
                            </div>
                        </div>
                    </div>
                )}

                {viewState === 'RESULT' && candidateData && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
                        <button
                            onClick={() => setViewState('SEARCH')}
                            className="text-sm font-semibold text-gray-500 hover:text-[#6F42C1] dark:text-gray-400 dark:hover:text-[#a074f0] mb-6 flex items-center gap-1 transition-colors"
                        >
                            ← Return to Search
                        </button>

                        {/* Candidate Profile Summary */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-8 transition-colors">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">Candidate Profile</h3>
                                    <p className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">{candidateData.fullName}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">Current Status</h3>
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm
                                        ${candidateData.verificationStatus === 'Submitted' || candidateData.verificationStatus === 'Approved'
                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-[#6F42C1] dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                            : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'}`}>
                                        {candidateData.verificationStatus === 'Unverified' ? 'Identity Confirmed' : candidateData.verificationStatus.toUpperCase()}
                                        {candidateData.verificationStatus !== 'Unverified' && <CheckCircle className="h-4 w-4" />}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-1">Registered Email</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-lg">{candidateData.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-1">Enrollment Number</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-lg font-mono">{candidateData.enrollmentNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-1">Applying For</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-lg">{candidateData.examId}</p>
                                </div>
                            </div>
                        </div>

                        {candidateData.verificationStatus === 'Submitted' || candidateData.verificationStatus === 'Approved' ? (
                            <div className="bg-white dark:bg-gray-900 p-12 rounded-xl shadow-lg border-t-8 border-green-600 dark:border-green-500 text-center">
                                <div className="bg-green-100 dark:bg-green-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Application Under Review</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
                                    Your documents have been securely transmitted to the <strong>Staff Selection Commission</strong>.
                                    You will receive a formal notification at <strong>{candidateData.email}</strong> upon completion of the verification process.
                                </p>
                                <div className="inline-block bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                    Reference ID: <span className="font-mono font-bold text-gray-900 dark:text-gray-200">{candidateData._id?.substring(0, 8).toUpperCase() || 'REF-8X92'}</span>
                                </div>
                            </div>
                        ) : (
                            <DocumentUpload
                                candidateData={candidateData}
                                onSubmitDocuments={handleSubmitComplete}
                            />
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default RecruitmentPage;
