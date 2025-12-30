import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen w-full relative bg-white dark:bg-gray-950 font-sans overflow-hidden flex flex-col justify-between [--grid-color:#e7e5e4] dark:[--grid-color:#333] transition-colors duration-300">
            {/* Dashed Top Fade Grid Background - No changes here */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
                        repeating-linear-gradient(
                          to right,
                          black 0px,
                          black 3px,
                          transparent 3px,
                          transparent 8px
                        ),
                        repeating-linear-gradient(
                          to bottom,
                          black 0px,
                          black 3px,
                          transparent 3px,
                          transparent 8px
                        ),
                        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
                    `,
                    WebkitMaskImage: `
                        repeating-linear-gradient(
                          to right,
                          black 0px,
                          black 3px,
                          transparent 3px,
                          transparent 8px
                        ),
                        repeating-linear-gradient(
                          to bottom,
                          black 0px,
                          black 3px,
                          transparent 3px,
                          transparent 8px
                        ),
                        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
                    `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            {/* Side Feedback Tab */}
            <div className="fixed right-0 top-1/2 z-50">
                <button
                    className="bg-[#6F42C1] dark:bg-[#5a32a3] text-white px-6 py-3 rounded-t-xl font-bold text-sm flex items-center gap-2 hover:bg-[#5a32a3] dark:hover:bg-[#4a2885] transition-all shadow-[0_4px_14px_0_rgba(111,66,193,0.39)] transform -rotate-90 origin-right translate-x-[42%]"
                >
                    <span className="tracking-wide">{t.feedback}</span>
                    <MessageSquare size={18} className="-rotate-90" />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-16 md:pt-24 flex flex-col items-center text-center">

                {/* Upcoming Events Tag - Content updated for MCD */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 text-[#6F42C1] dark:text-purple-300 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6F42C1] dark:bg-purple-400"></span>
                        </span>
                        {t.latestCirculars}
                    </span>
                    <ArrowUpRight size={14} />
                </div>

                {/* Main Heading - Content updated for MCD HRMS */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
                    {t.heroTitlePrefix}<span className="text-[#6F42C1] dark:text-[#a074f0]">{t.heroTitleHighlight}</span><br className="hidden md:block" />
                    {t.heroTitleSuffix}
                </h1>

                {/* Subheading - Content updated for MCD HRMS */}
                <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed transition-colors">
                    {t.heroSubtitle}
                </p>

                {/* CTA Buttons - Content updated for MCD HRMS */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <button className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                        {t.employeeLogin}
                    </button>
                    <button className="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                        {t.deptAdmin}
                    </button>
                </div>
            </div>

            {/* Devices Footer Image - No changes here */}
            <div className="relative z-10 w-full mt-auto">
                <img
                    src="/devices.png"
                    alt="MCD HRMS Application displayed on various devices"
                    className="w-full h-auto object-contain max-h-[500px] xl:max-h-[600px] grayscale transition-all duration-500 hover:grayscale-0"
                />
            </div>


        </div>
    );
};

export default Hero;