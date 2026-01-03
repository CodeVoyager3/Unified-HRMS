import React, { useState, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';

const RecruitmentSearch = ({ onSearch }) => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [dob, setDob] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/recruitment');
            const data = await response.json();
            if (data.success) {
                setExams(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch exams", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (selectedExam && enrollmentNumber && dob) {
            onSearch(selectedExam, enrollmentNumber, dob);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-lg mx-auto transform hover:shadow-xl transition duration-300">
            <div className="bg-[#6F42C1] dark:bg-[#5a32a3] p-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-3">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">Candidate Status Portal</h2>
                <p className="text-purple-100 text-sm mt-1">Official Recruitment Board Verification</p>
            </div>

            <div className="p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Examination Name</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent outline-none transition-all"
                            required
                        >
                            <option value="">Select Examination...</option>
                            {exams.map(exam => (
                                <option key={exam.examId} value={exam.examId}>
                                    {exam.examName.toUpperCase()} ({exam.year}) - {exam.examId}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Enrollment No.</label>
                            <input
                                type="text"
                                value={enrollmentNumber}
                                onChange={(e) => setEnrollmentNumber(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent outline-none transition-all uppercase placeholder-gray-400"
                                placeholder="EN12345"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Date of Birth</label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6F42C1] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#6F42C1] hover:bg-[#5a32a3] text-white py-3.5 rounded-lg font-bold shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Check Application Status
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4 px-4 leading-relaxed">
                        By checking status, you agree to the <span className="underline cursor-pointer hover:text-[#6F42C1]">Terms of Service</span>.
                        Unauthorized access is a punishable offense under IT Act.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RecruitmentSearch;
