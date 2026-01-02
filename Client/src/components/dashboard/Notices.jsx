import React, { useState } from 'react';
import { Plus, Briefcase, MapPin, Calendar, Trash2, Clock, FileText, X, Eye, Download, Building2, Bell } from 'lucide-react';

const Notices = ({ language }) => {
    const [notices, setNotices] = useState([
        {
            id: 1,
            title: 'Senior Medical Officer Recruitment',
            location: 'Rohini Zone',
            department: 'Health',
            deadline: '15 Days',
            posted: '2 days ago',
            description: 'Applications are invited for the post of Senior Medical Officer. Candidates must have MD/MS with 5 years of experience.',
            driveLink: '#'
        },
        {
            id: 2,
            title: 'Sanitation Supervisor Urgently Required',
            location: 'Civil Lines',
            department: 'Sanitation',
            deadline: '10 Days',
            posted: '5 days ago',
            description: 'Urgent requirement for Sanitation Supervisor to oversee cleanliness drives in Civil Lines zone.',
            driveLink: '#'
        }
    ]);

    const [newNotice, setNewNotice] = useState({
        title: '',
        location: '',
        department: '',
        deadline: '',
        description: '',
        driveLink: ''
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    const handleAddNotice = (e) => {
        e.preventDefault();
        const notice = {
            id: Date.now(),
            ...newNotice,
            posted: 'Just now'
        };
        setNotices([notice, ...notices]);
        setNewNotice({ title: '', location: '', department: '', deadline: '', description: '', driveLink: '' });
        setShowForm(false);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'en' ? 'Notices & Vacancies' : 'सूचनाएं और रिक्तियां'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Manage circulars and job postings' : 'परिपत्र और नौकरी पोस्टिंग प्रबंधित करें'}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] text-white rounded-xl hover:bg-[#5a32a3] transition-colors shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    {language === 'en' ? 'Create New Notice' : 'नई सूचना बनाएं'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell size={20} className="text-[#6F42C1]" />
                        {language === 'en' ? 'Post New Vacancy / Notice' : 'नई रिक्ति / सूचना पोस्ट करें'}
                    </h3>
                    <form onSubmit={handleAddNotice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Title / Subject' : 'शीर्षक / विषय'}
                            </label>
                            <input
                                required
                                type="text"
                                value={newNotice.title}
                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                                placeholder="e.g. Senior Medical Officer Recruitment"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Locality / Zone' : 'इलाका / क्षेत्र'}
                            </label>
                            <input
                                required
                                type="text"
                                value={newNotice.location}
                                onChange={(e) => setNewNotice({ ...newNotice, location: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                                placeholder="e.g. Rohini Sector 12"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Department' : 'विभाग'}
                            </label>
                            <select
                                required
                                value={newNotice.department}
                                onChange={(e) => setNewNotice({ ...newNotice, department: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                            >
                                <option value="">Select Department</option>
                                <option value="Health">Health</option>
                                <option value="Sanitation">Sanitation</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Education">Education</option>
                                <option value="General Admin">General Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Time Limit' : 'समय सीमा'}
                            </label>
                            <input
                                required
                                type="text"
                                value={newNotice.deadline}
                                onChange={(e) => setNewNotice({ ...newNotice, deadline: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                                placeholder="e.g. 15 Days"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Drive Link (PDF/Doc)' : 'ड्राइव लिंक (पीडीएफ/डॉक)'}
                            </label>
                            <input
                                type="url"
                                value={newNotice.driveLink}
                                onChange={(e) => setNewNotice({ ...newNotice, driveLink: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'en' ? 'Description' : 'विवरण'}
                            </label>
                            <textarea
                                required
                                rows="3"
                                value={newNotice.description}
                                onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6F42C1]"
                                placeholder={language === 'en' ? 'Enter notice details, eligibility criteria, etc...' : 'सूचना विवरण दर्ज करें...'}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                {language === 'en' ? 'Cancel' : 'रद्द करें'}
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#6F42C1] text-white rounded-lg hover:bg-[#5a32a3]"
                            >
                                {language === 'en' ? 'Publish Notice' : 'सूचना प्रकाशित करें'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {notices.map((notice) => (
                    <div
                        key={notice.id}
                        className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg hover:border-[#6F42C1]/30 dark:hover:border-[#a074f0]/30 transition-all duration-300 group cursor-pointer"
                        onClick={() => setSelectedNotice(notice)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#6F42C1]/10 text-[#6F42C1] dark:bg-[#a074f0]/20 dark:text-[#a074f0] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#6F42C1] dark:group-hover:text-[#a074f0] transition-colors">
                                    {notice.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} /> {notice.location}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="flex items-center gap-1">
                                        <Building2 size={14} /> {notice.department}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="flex items-center gap-1 text-orange-500 font-medium">
                                        <Clock size={14} /> {notice.deadline} left
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            <span className="text-xs text-gray-400 ml-auto md:ml-0 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                {notice.posted}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle delete
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Popup Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedNotice(null)}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-[#6F42C1]/10 text-[#6F42C1] dark:bg-[#a074f0]/20 dark:text-[#a074f0] text-xs font-bold rounded-full uppercase tracking-wider">
                                        {selectedNotice.department}
                                    </span>
                                    <span className="text-gray-400 text-xs">•</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                                        <Clock size={12} /> Posted {selectedNotice.posted}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {selectedNotice.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Key Details Grid */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{language === 'en' ? 'Location' : 'स्थान'}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin size={16} className="text-[#6F42C1]" />
                                        {selectedNotice.location}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{language === 'en' ? 'Deadline' : 'समय सीमा'}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Calendar size={16} className="text-orange-500" />
                                        {selectedNotice.deadline}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                                    {language === 'en' ? 'Description' : 'विवरण'}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedNotice.description || "No description provided."}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                {selectedNotice.driveLink && (
                                    <a
                                        href={selectedNotice.driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#6F42C1] text-white rounded-xl font-medium hover:bg-[#5a32a3] transition-colors shadow-lg shadow-purple-500/20"
                                    >
                                        <Download size={18} />
                                        {language === 'en' ? 'Download / View Document' : 'दस्तावेज़ डाउनलोड / देखें'}
                                    </a>
                                )}
                                <button className="px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    {language === 'en' ? 'Share' : 'साझा करें'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;
