import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

const InventoryManagement = ({ language }) => {
    const [overview, setOverview] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        setLoading(true);
        try {
            const [overviewRes, requestsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/inventory/overview`),
                fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/inventory/requests?status=Pending`)
            ]);

            const overviewData = await overviewRes.json();
            const requestsData = await requestsRes.json();

            if (overviewData.success) setOverview(overviewData.overview);
            if (requestsData.success) setRequests(requestsData.requests);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/commissioner/inventory/allocate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    approvedQuantity: requests.find(r => r._id === requestId)?.quantity,
                    commissionerId: 'COMM001'
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Approved!');
                fetchInventoryData();
            }
        } catch (error) {
            console.error('Error approving:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'en' ? 'Inventory Management' : 'सामग्री प्रबंधन'}
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {overview?.byStatus?.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat._id}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    {language === 'en' ? 'Pending Requests' : 'लंबित अनुरोध'}
                </h3>
                <div className="space-y-4">
                    {requests.slice(0, 10).map((req) => (
                        <div key={req._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">{req.itemName}</h4>
                                <p className="text-sm text-gray-500">Qty: {req.quantity} | Zone: {req.zone} | Urgency: {req.urgency}</p>
                            </div>
                            <button
                                onClick={() => handleApprove(req._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InventoryManagement;
