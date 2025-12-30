import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

const Hero = () => {
    return (
        <div className="min-h-screen w-full relative bg-white font-sans overflow-hidden flex flex-col justify-between">
            {/* Dashed Top Fade Grid Background - No changes here */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
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
                    className="bg-[#6F42C1] text-white px-6 py-3 rounded-t-xl font-bold text-sm flex items-center gap-2 hover:bg-[#5a32a3] transition-all shadow-[0_4px_14px_0_rgba(111,66,193,0.39)] transform -rotate-90 origin-right translate-x-[42%]"
                >
                    <span className="tracking-wide">Feedback</span>
                    <MessageSquare size={18} className="-rotate-90" />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-16 md:pt-24 flex flex-col items-center text-center">

                {/* Upcoming Events Tag - Content updated for MCD */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-[#6F42C1] text-sm font-medium hover:bg-purple-100 transition-colors cursor-pointer">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6F42C1]"></span>
                        </span>
                        Latest Circulars & Notifications
                    </span>
                    <ArrowUpRight size={14} />
                </div>

                {/* Main Heading - Content updated for MCD HRMS */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                    Empowering Delhi's <span className="text-[#6F42C1]">Municipal Workforce</span><br className="hidden md:block" />
                    with Unified HRMS
                </h1>

                {/* Subheading - Content updated for MCD HRMS */}
                <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                    A single, secure platform for <span className="text-[#6F42C1] font-medium">MCD employees</span> to manage attendance, payroll, transfers, and grievances efficiently and transparently.
                </p>

                {/* CTA Buttons - Content updated for MCD HRMS */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <button className="px-8 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                        Employee Login
                    </button>
                    <button className="px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                        Department Admin
                    </button>
                </div>
            </div>

            {/* Devices Footer Image - No changes here */}
            <div className="relative z-10 w-full mt-auto">
                <img
                    src="/devices.png"
                    alt="MCD HRMS Application displayed on various devices"
                    className="w-full h-auto object-contain max-h-[500px] xl:max-h-[600px]"
                />
            </div>
        </div>
    );
};

export default Hero;