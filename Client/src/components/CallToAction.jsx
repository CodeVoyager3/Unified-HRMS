import React from 'react';
import { Download, ShieldCheck, Smartphone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CallToAction = () => {
    const { t } = useLanguage();

    return (
        <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="relative bg-[#6F42C1] dark:bg-[#5a32a3] rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl transition-colors duration-300">

                    {/* Background Decorative Circles */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

                        {/* Left Side: Mobile App Pitch */}
                        <div className="lg:w-1/2 text-white">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                                <Smartphone size={14} /> {t.mobileFirst}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                {t.pocketTitle}
                            </h2>
                            <p className="text-purple-100 text-lg mb-8 leading-relaxed">
                                {t.pocketDesc}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center gap-3 bg-white text-[#6F42C1] px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg cursor-pointer">
                                    <Download size={20} />
                                    {t.getPlayStore}
                                </button>
                                <button className="flex items-center gap-3 bg-transparent border border-white/40 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all cursor-pointer">
                                    {t.iosComing}
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Admin/Employee Login Card */}
                        <div className="lg:w-2/5 w-full">
                            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl transition-colors duration-300">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">{t.webPortal}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 transition-colors">{t.webDesc}</p>

                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl group transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-colors">
                                                <ShieldCheck className="text-[#6F42C1] dark:text-[#a074f0]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-gray-900 dark:text-white transition-colors">{t.employeeLogin}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{t.accessAadhaar}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[#6F42C1] dark:group-hover:text-[#a074f0] transition-colors" />
                                    </button>

                                    <button className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl group transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-colors">
                                                <ShieldCheck className="text-[#6F42C1] dark:text-[#a074f0]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-gray-900 dark:text-white transition-colors">{t.deptAdmin}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{t.authOnly}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[#6F42C1] dark:group-hover:text-[#a074f0] transition-colors" />
                                    </button>
                                </div>

                                <p className="mt-6 text-center text-xs text-gray-400 transition-colors">
                                    {t.protectedText}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;