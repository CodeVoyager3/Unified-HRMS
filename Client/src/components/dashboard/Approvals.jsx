import React, { useState } from 'react';
import { Check, X, Clock, FileText, ChevronRight, User, Building2, Calendar, Award } from 'lucide-react';

const Approvals = ({ language }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const requests = [
        {
            id: 1,
            name: 'Dr. Ankit Sharma',
            empId: 'MCD-H-2024-001',
            type: 'Promotion',
            department: 'Health Department',
            currentRole: 'Senior Resident',
            proposedRole: 'Chief Medical Officer',
            date: '28 Dec 2025',
            status: 'pending',
            experience: '8 Years',
            performanceScore: '92/100',
            reason: 'Vacancy in CMO position and excellent track record.'
        },
        {
            id: 2,
            name: 'Priya Singh',
            empId: 'MCD-E-2023-045',
            type: 'Promotion',
            department: 'Engineering Dept.',
            currentRole: 'Assistant Engineer',
            proposedRole: 'Executive Engineer',
            date: '25 Dec 2025',
            status: 'pending',
            experience: '6 Years',
            performanceScore: '88/100',
            reason: 'Completed 5 years of service as AE with no disciplinary actions.'
        },
        {
            id: 3,
            name: 'Ravi Kumar',
            empId: 'MCD-S-2018-112',
            type: 'Salary Increment',
            department: 'Sanitation Dept.',
            currentRole: 'L-10',
            proposedRole: 'L-11',
            date: '20 Dec 2025',
            status: 'pending',
            experience: '12 Years',
            performanceScore: '85/100',
            reason: 'Annual Increment (7th Pay Commission Guidelines).'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Pending Approvals' : 'लंबित अनुमोदन'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Review and authorize personnel requests' : 'कार्मिक अनुरोधों की समीक्षा और अनुमति दें'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                        {language === 'en' ? 'Pending: 3' : 'लंबित: 3'}
                    </span>
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        {language === 'en' ? 'Total: 12' : 'कुल: 12'}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">{language === 'en' ? 'Employee' : 'कर्मचारी'}</th>
                                <th className="px-6 py-4">{language === 'en' ? 'Request Type' : 'अनुरोध प्रकार'}</th>
                                <th className="px-6 py-4">{language === 'en' ? 'Department' : 'विभाग'}</th>
                                <th className="px-6 py-4">{language === 'en' ? 'Date' : 'दिनांक'}</th>
                                <th className="px-6 py-4 text-right">{language === 'en' ? 'Action' : 'कार्रवाई'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {requests.map((req) => (
                                <tr
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold group-hover:bg-[#6F42C1] group-hover:text-white transition-colors">
                                                {req.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{req.name}</p>
                                                <p className="text-xs text-gray-500">{req.empId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                            <Award size={14} />
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {req.department}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {req.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[#6F42C1] transition-colors" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRequest(null)}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#6F42C1] text-white p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                                    <p className="text-white/80 text-sm">{selectedRequest.empId}</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <User size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="mt-4 flex gap-4 text-sm">
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <Building2 size={16} /> {selectedRequest.department}
                                </div>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <Clock size={16} /> {selectedRequest.experience} Exp.
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Comparison Card */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between relative">
                                <div className="w-[45%]">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.currentRole}</p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 text-gray-400">
                                    <ChevronRight size={16} />
                                </div>
                                <div className="w-[45%] text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Proposed</p>
                                    <p className="font-semibold text-[#6F42C1] dark:text-[#a074f0]">{selectedRequest.proposedRole}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Request Type</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Performance Score</p>
                                    <p className="font-medium text-green-600 dark:text-green-400">{selectedRequest.performanceScore}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason/Justification</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                        {selectedRequest.reason}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button className="py-2.5 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <X size={18} />
                                    {language === 'en' ? 'Reject Request' : 'अस्वीकार करें'}
                                </button>
                                <button className="py-2.5 bg-[#6F42C1] text-white hover:bg-[#5a32a3] rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2">
                                    <Check size={18} />
                                    {language === 'en' ? 'Approve Request' : 'स्वीकृत करें'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
