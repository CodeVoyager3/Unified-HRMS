import React from 'react';
import {
    AlertTriangle, CheckCircle, Clock, AlertCircle, TrendingUp, MapPin, User
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import {
    grievanceStats, sentimentData, criticalComplaints, slaBreaches, zoneComplaintDistribution
} from '../../data/grievanceData';

const GrievanceRedressal = ({ language }) => {

    const [selectedGrievance, setSelectedGrievance] = React.useState(null);
    const [isViewAllOpen, setIsViewAllOpen] = React.useState(false);
    const [actionModal, setActionModal] = React.useState(null); // { type: 'sla', id: '...' }

    const handleTakeAction = (id, officer) => {
        alert(`Show Cause Notice generated for ${officer} regarding Breach #${id}.\n(Mock Action: Notice Sent)`);
    };

    const StatusBadge = ({ status }) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    // Simple Modal Component
    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#1e1b4b] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-white/10">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors">Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': case 'Escalated': return 'text-red-500 bg-red-50 border-red-200';
            case 'High': return 'text-orange-500 bg-orange-50 border-orange-200';
            case 'In Progress': return 'text-blue-500 bg-blue-50 border-blue-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e1b4b] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Complaints</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{grievanceStats.total_complaints}</h3>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1b4b] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Resolved Today</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">{grievanceStats.resolved_today}</h3>
                        </div>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1b4b] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pending Critical</p>
                            <h3 className="text-2xl font-bold text-red-500 mt-1">{grievanceStats.pending_critical}</h3>
                        </div>
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1b4b] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Avg Resolution</p>
                            <h3 className="text-2xl font-bold text-blue-600 mt-1">{grievanceStats.avg_resolution_time}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sentiment Analysis */}
                <div className="bg-white dark:bg-[#1e1b4b] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Public Sentiment</h3>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Score */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{grievanceStats.sentiment_score}</span>
                            <p className="text-xs text-gray-500">Score</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-medium text-gray-500 mt-[-20px]">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Satisfied</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Neutral</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Dissatisfied</div>
                    </div>
                </div>

                {/* Critical Feed */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1b4b] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Critical Issues Feed</h3>
                        <button onClick={() => setIsViewAllOpen(true)} className="text-sm text-[#6F42C1] font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {criticalComplaints.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedGrievance(item)}
                                className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors border-l-4 border-l-red-500 cursor-pointer group"
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.issue}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.location} ({item.zone})</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {item.reported_time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Zone Wise Complaints */}
                <div className="bg-white dark:bg-[#1e1b4b] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Complaints by Zone</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={zoneComplaintDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="complaints" fill="#6F42C1" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SLA Breaches */}
                <div className="bg-white dark:bg-[#1e1b4b] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} /> SLA Breaches (Action Required)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">ID</th>
                                    <th className="px-4 py-3">Issue</th>
                                    <th className="px-4 py-3">Overdue</th>
                                    <th className="px-4 py-3">Officer</th>
                                    <th className="px-4 py-3 rounded-r-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {slaBreaches.map((breach) => (
                                    <tr key={breach.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3 font-medium">{breach.id}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {breach.issue}
                                            <div className="text-[10px] text-gray-400">{breach.zone}</div>
                                        </td>
                                        <td className="px-4 py-3 text-red-500 font-bold">+{breach.days_open} Days</td>
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                <User size={12} />
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{breach.responsible_officer}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleTakeAction(breach.id, breach.responsible_officer)}
                                                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition-colors border border-red-200"
                                            >
                                                Issue Notice
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal title="Grievance Details" isOpen={!!selectedGrievance} onClose={() => setSelectedGrievance(null)}>
                {selectedGrievance && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-white">{selectedGrievance.issue}</h4>
                                <p className="text-sm text-gray-500">ID: {selectedGrievance.id}</p>
                            </div>
                            <StatusBadge status={selectedGrievance.priority} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Location</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <MapPin size={14} className="text-[#6F42C1]" /> {selectedGrievance.location}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Zone</p>
                                <p className="text-sm font-medium">{selectedGrievance.zone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Reported</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Clock size={14} className="text-[#6F42C1]" /> {selectedGrievance.reported_time}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p>
                                <p className="text-sm font-medium">{selectedGrievance.status}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                {selectedGrievance.description}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                            <button onClick={() => alert("Escalated to Deputy Commissioner")} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                Escalate Issue
                            </button>
                            <button onClick={() => alert("Marked as Resolved")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                Mark Resolved
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal title="All Critical Complaints" isOpen={isViewAllOpen} onClose={() => setIsViewAllOpen(false)}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Showing all active critical complaints requiring immediate attention.</p>
                    {/* Reuse Mock Data for Demo */}
                    {criticalComplaints.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-800 dark:text-white">{item.issue}</h4>
                                    <StatusBadge status={item.priority} />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span>{item.location}</span>
                                    <span>{item.reported_time}</span>
                                </div>
                            </div>
                            <button className="self-center px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default GrievanceRedressal;
