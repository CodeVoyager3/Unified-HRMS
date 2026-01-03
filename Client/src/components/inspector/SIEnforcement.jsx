import React, { useState, useEffect } from 'react';
import { Camera, MapPin, DollarSign, FileText, Send, AlertOctagon, History } from 'lucide-react';

const SIEnforcement = ({ language = 'en', currentUser }) => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalChallans: 0 });
    const [recentChallans, setRecentChallans] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        violatorName: '',
        mobileNumber: '',
        violationType: 'Littering',
        amount: '',
        location: '',
        coordinates: null
    });

    const violationTypes = [
        { value: 'Littering', label: language === 'en' ? 'Littering' : 'कूड़ा फैलाना', defaultAmount: 500 },
        { value: 'Open Burning', label: language === 'en' ? 'Open Burning' : 'खुले में आग लगाना', defaultAmount: 5000 },
        { value: 'Construction Waste', label: language === 'en' ? 'Construction Waste (C&D)' : 'निर्माण अपशिष्ट', defaultAmount: 2000 },
        { value: 'Illegal Hoarding', label: language === 'en' ? 'Illegal Hoarding' : 'अवैध होर्डिंग', defaultAmount: 1000 },
        { value: 'Mosquito Breeding', label: language === 'en' ? 'Mosquito Breeding' : 'मच्छर प्रजनन', defaultAmount: 1000 },
    ];

    // Fetch Challan Data
    const fetchChallanData = async () => {
        if (!currentUser?.Ward) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/challan/stats/${currentUser.Ward}`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
                setRecentChallans(data.recent);
            }
        } catch (error) {
            console.error("Error fetching challans:", error);
        }
    };

    useEffect(() => {
        fetchChallanData();
    }, [currentUser]);

    // Handle Form Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-set amount if violation type changes
        if (name === 'violationType') {
            const type = violationTypes.find(t => t.value === value);
            if (type) {
                setFormData(prev => ({ ...prev, violationType: value, amount: type.defaultAmount }));
            }
        }
    };

    // Auto-detect Location
    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        coordinates: { latitude, longitude },
                        location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` // Simplified for now
                    }));
                },
                (error) => alert('Error getting location')
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                ward: currentUser.Ward,
                issuedBy: currentUser.employeeId,
                location: {
                    address: formData.location,
                    latitude: formData.coordinates?.latitude,
                    longitude: formData.coordinates?.longitude
                }
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/challan/issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                alert(language === 'en' ? 'Challan Issued Successfully!' : 'चालान सफलतापूर्वक जारी किया गया!');
                setFormData({ violatorName: '', mobileNumber: '', violationType: 'Littering', amount: '', location: '', coordinates: null });
                fetchChallanData(); // Refresh list
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error issuing challan:", error);
            alert('Failed to issue challan');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-red-100 text-sm font-medium mb-1">{language === 'en' ? 'Total Fines Issued' : 'कुल चालान जारी'}</p>
                            <h3 className="text-3xl font-bold">{stats.totalChallans}</h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <FileText size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-orange-100 text-sm font-medium mb-1">{language === 'en' ? 'Revenue Collected' : 'कुल राजस्व'}</p>
                            <h3 className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issue Challan Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
                        <AlertOctagon className="text-red-500" />
                        <h2 className="text-xl font-bold">{language === 'en' ? 'Issue New Challan' : 'नया चालान जारी करें'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">{language === 'en' ? 'Violator Name' : 'उल्लंघनकर्ता का नाम'}</label>
                                <input
                                    type="text"
                                    name="violatorName"
                                    value={formData.violatorName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">{language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{language === 'en' ? 'Violation Type' : 'उल्लंघन का प्रकार'}</label>
                            <select
                                name="violationType"
                                value={formData.violationType}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                            >
                                {violationTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{language === 'en' ? 'Fine Amount (₹)' : 'जुर्माना राशि (₹)'}</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-bold text-red-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{language === 'en' ? 'Location' : 'स्थान'}</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Detected or Manual Address"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    title="Detect GPS"
                                >
                                    <MapPin size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Camera Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <Camera size={24} className="mb-2" />
                            <span className="text-xs">{language === 'en' ? 'Click to add proof' : 'सबूत जोड़ने के लिए क्लिक करें'}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span>{language === 'en' ? 'Issuing...' : 'जारी किया जा रहा है...'}</span>
                            ) : (
                                <>
                                    <span>{language === 'en' ? 'Issue Challan' : 'चालान जारी करें'}</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Recent Challans List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
                        <History className="text-gray-500" />
                        <h2 className="text-xl font-bold">{language === 'en' ? 'Recent Violations' : 'हाल के उल्लंघन'}</h2>
                    </div>

                    <div className="space-y-4">
                        {recentChallans.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                {language === 'en' ? 'No recent challans found.' : 'कोई हालिया चालान नहीं मिला।'}
                            </div>
                        ) : (
                            recentChallans.map((challan) => (
                                <div key={challan._id} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                        ₹{challan.amount}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 dark:text-white text-sm">{challan.violationType}</h4>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(challan.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {challan.violatorName} • {challan.location?.address?.substring(0, 20)}...
                                        </p>
                                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                                            {challan.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SIEnforcement;
