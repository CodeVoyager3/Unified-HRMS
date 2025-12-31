import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Users, Building2, CheckCircle2, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StatsSection = () => {
    const { t } = useLanguage();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const stats = [
        {
            label: t.totalEmployees,
            value: 150000,
            suffix: "+",
            icon: <Users className="text-[#6F42C1] dark:text-[#a074f0]" size={28} />,
            description: t.registeredStaff
        },
        {
            label: t.activeDepts,
            value: 32,
            suffix: "",
            icon: <Building2 className="text-[#6F42C1] dark:text-[#a074f0]" size={28} />,
            description: t.integratedDir
        },
        {
            label: t.grievanceRes,
            value: 98.4,
            suffix: "%",
            decimals: 1,
            icon: <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0]" size={28} />,
            description: t.avgSuccess
        },
        {
            label: t.zonalOffices,
            value: 12,
            suffix: "",
            icon: <MapPin className="text-[#6F42C1] dark:text-[#a074f0]" size={28} />,
            description: t.acrossDelhi
        }
    ];

    return (
        <section ref={ref} className="py-16 bg-white dark:bg-gray-950 w-full transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                        {t.systemImpact}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
                        {t.impactDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                        >
                            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl group-hover:bg-[#6F42C1] dark:group-hover:bg-[#a074f0] group-hover:text-white transition-colors duration-300">
                                {React.cloneElement(stat.icon, {
                                    className: "group-hover:text-white transition-colors"
                                })}
                            </div>

                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 transition-colors">
                                {inView ? (
                                    <CountUp
                                        end={stat.value}
                                        duration={2.5}
                                        decimals={stat.decimals || 0}
                                        suffix={stat.suffix}
                                    />
                                ) : (
                                    "0"
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                                {stat.label}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 italic transition-colors">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;