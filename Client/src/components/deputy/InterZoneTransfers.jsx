import React, { useState } from 'react';
import { ArrowRightLeft, MapPin, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const InterZoneTransfers = ({ language = 'en', userZone }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const allTransfers = [
        { id: 'TR-401', employee: 'Suresh Raina', from: 'ROHINI-A', fromZone: 'Rohini Zone', to: 'ROHINI-C', toZone: 'Rohini Zone', reason: 'Operational Requirement', status: 'Pending', date: '2026-01-10' },
        { id: 'TR-402', employee: 'Meena kumari', from: 'ROHINI-B', fromZone: 'Rohini Zone', to: 'RITHALA', toZone: 'Rohini Zone', reason: 'Medical Grounds', status: 'Approved', date: '2026-01-05' },
        { id: 'TR-405', employee: 'Karan Mehra', from: 'VIJAY VIHAR', fromZone: 'Rohini Zone', to: 'ROHINI-A', toZone: 'Rohini Zone', reason: 'Self Request', status: 'Denied', date: '2026-01-02' },
        { id: 'TR-410', employee: 'Vikas Gupta', from: 'BUDH VIHAR', fromZone: 'Rohini Zone', to: 'CIVIL LINES-A', toZone: 'Civil Lines Zone', reason: 'Administrative', status: 'Pending', date: '2026-01-12' },
        { id: 'TR-500', employee: 'Rahul Dravid', from: 'KAROL BAGH-A', fromZone: 'Karol Bagh Zone', to: 'ROHINI-A', toZone: 'Rohini Zone', reason: 'Request', status: 'Pending', date: '2026-01-15' },
    ];

    const transfers = allTransfers.filter(tr => tr.fromZone === userZone || tr.toZone === userZone);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Denied': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {language === 'en' ? 'Inter-Ward Transfers' : 'अंतर-वार्ड स्थानांतरण'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Manage and approve employee movement across different wards' : 'विभिन्न वार्ड में कर्मचारी आवाजाही को प्रबंधित और अनुमोदित करें'}
                    </p>
                </div>
                <button className="px-6 py-2.5 bg-[#6F42C1] hover:bg-[#5a35a0] text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2">
                    <ArrowRightLeft size={18} />
                    {language === 'en' ? 'New Transfer Request' : 'नया स्थानांतरण अनुरोध'}
                </button>
            </div>

            {/* Transfer List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Employee' : 'कर्मचारी'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'From → To' : 'कहाँ से → कहाँ तक'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Reason' : 'कारण'}</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Status' : 'स्थिति'}</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Action' : 'कार्रवाई'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {transfers.map((tr) => (
                                <tr key={tr.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{tr.employee}</div>
                                        <div className="text-xs text-gray-500">{tr.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{tr.from}</span>
                                            <ArrowRightLeft size={14} className="text-purple-400" />
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{tr.to}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tr.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tr.status)}`}>
                                            {tr.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tr.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-all" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Deny">
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                {language === 'en' ? 'Resolved on' : 'निपटाया गया'} {tr.date}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InterZoneTransfers;
