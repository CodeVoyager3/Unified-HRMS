import React from 'react';
import {
    MapPinCheckInside,
    ReceiptIndianRupee,
    BookUser,
    MessageCircleQuestion,
    ArrowRightLeft,
    TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FeaturesGrid = () => {
    const { t } = useLanguage();

    const features = [
        {
            title: t.feat1Title,
            description: t.feat1Desc,
            icon: <MapPinCheckInside size={32} />,
            colorTag: "efficiency"
        },
        {
            title: t.feat2Title,
            description: t.feat2Desc,
            icon: <ReceiptIndianRupee size={32} />,
            colorTag: "speed"
        },
        {
            title: t.feat3Title,
            description: t.feat3Desc,
            icon: <BookUser size={32} />,
            colorTag: "transparency"
        },
        {
            title: t.feat4Title,
            description: t.feat4Desc,
            icon: <ArrowRightLeft size={32} />,
            colorTag: "fairness"
        },
        {
            title: t.feat5Title,
            description: t.feat5Desc,
            icon: <MessageCircleQuestion size={32} />,
            colorTag: "empowerment"
        },
        {
            title: t.feat6Title,
            description: t.feat6Desc,
            icon: <TrendingUp size={32} />,
            colorTag: "insight"
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-gray-950 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[#6F42C1] dark:text-[#a074f0] font-bold uppercase tracking-wider text-sm mb-3 block">
                        {t.coreFunc}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
                        {t.modernizingOps}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors">
                        {t.modernizingDesc}
                    </p>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:border-purple-100 dark:hover:border-purple-900/50 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6F42C1] to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                            {/* Icon Container */}
                            <div className="mb-6 relative inline-block">
                                <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/40 rounded-2xl rotate-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-[#6F42C1] dark:bg-[#5a32a3] text-white p-5 rounded-2xl shadow-md group-hover:-translate-y-1 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-[#6F42C1] dark:group-hover:text-[#a074f0] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 transition-colors">
                                {feature.description}
                            </p>

                            {/* Learn More Link */}
                            <a href="#" className="inline-flex items-center gap-2 font-semibold text-[#6F42C1] dark:text-[#a074f0] hover:underline decoration-2 underline-offset-4">
                                {t.learnMore}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;