import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    const hrServicesLinks = [t.hrLink1, t.hrLink2, t.hrLink3, t.hrLink4, t.hrLink5];
    const citizenLinks = [t.citLink1, t.citLink2, t.citLink3, t.citLink4, t.citLink5];
    const resourceLinks = [t.resLink1, t.resLink2, t.resLink3, t.resLink4, t.resLink5];
    const supportLinks = [t.supLink1, t.supLink2, t.supLink3, t.supLink4, t.supLink5];

    return (
        <footer className="w-full font-sans" role="contentinfo">
            {/* Main Footer Section */}
            <div className="bg-white dark:bg-gray-900 pt-12 pb-8 px-4 md:px-8 lg:px-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 justify-between">

                    {/* Left Section - MCD Branding */}
                    <div className="flex-shrink-0 lg:w-1/4">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" alt="MCD Logo" className="h-12 w-auto object-contain" />
                                <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="text-[#6F42C1] dark:text-[#a074f0] font-bold leading-tight">
                                    {t.mcdHrms.split(' ').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}{i < t.mcdHrms.split(' ').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 transition-colors">
                                {t.mcdDesc}
                            </p>

                            {/* Contact Info - Vital for Gov Sites */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                    <Phone size={14} className="text-[#6F42C1] dark:text-[#a074f0]" /> <span>{t.tollFree}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                    <Mail size={14} className="text-[#6F42C1] dark:text-[#a074f0]" /> <span>helpdesk-hrms@mcd.nic.in</span>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="flex gap-3">
                                <a href="#" target="_blank" rel="noreferrer" aria-label="MCD Twitter Handle"
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#6F42C1] dark:hover:bg-[#a074f0] hover:text-white dark:hover:text-white transition-all duration-300">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" target="_blank" rel="noreferrer" aria-label="MCD Facebook Page"
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#6F42C1] dark:hover:bg-[#a074f0] hover:text-white dark:hover:text-white transition-all duration-300">
                                    <Facebook size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section - Functional Categories */}
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8 lg:px-6">
                        {/* HR Services */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider underline decoration-[#6F42C1] dark:decoration-[#a074f0] decoration-2 underline-offset-8 transition-colors">{t.hrServices}</h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                {hrServicesLinks.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6F42C1] dark:hover:text-[#a074f0] transition-colors hover:underline underline-offset-4">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Citizen Corner */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider underline decoration-[#6F42C1] dark:decoration-[#a074f0] decoration-2 underline-offset-8 transition-colors">{t.citizens}</h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                {citizenLinks.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6F42C1] dark:hover:text-[#a074f0] transition-colors hover:underline underline-offset-4">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider underline decoration-[#6F42C1] dark:decoration-[#a074f0] decoration-2 underline-offset-8 transition-colors">{t.resources}</h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                {resourceLinks.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6F42C1] dark:hover:text-[#a074f0] transition-colors hover:underline underline-offset-4">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider underline decoration-[#6F42C1] dark:decoration-[#a074f0] decoration-2 underline-offset-8 transition-colors">{t.support}</h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                {supportLinks.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6F42C1] dark:hover:text-[#a074f0] transition-colors hover:underline underline-offset-4">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Far Right Section - Gov Compliance */}
                    <div className="flex-shrink-0 lg:w-1/5 flex flex-col items-start lg:items-end space-y-6">
                        <div className="flex flex-col items-start lg:items-end w-full">
                            <span className="text-xs font-semibold text-gray-400 uppercase mb-3 text-center lg:text-right w-full">{t.projectBy}</span>
                            <div className="flex flex-col gap-4 items-start lg:items-end">
                                {/* Digital India & MCD Combo */}
                                <div className="h-14 w-40 bg-white rounded p-2 flex items-center justify-center">
                                    <img src="/digitalIndia.png" alt="Digital India Logo" className="h-full w-auto object-contain" />
                                </div>
                                <div className="h-14 w-40 bg-white rounded p-2 flex items-center justify-center">
                                    <img src="/embelem.png" alt="State Emblem" className="h-full w-auto object-contain" />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-4 leading-tight font-medium text-center lg:text-right transition-colors bg-transparent">
                                {t.address}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Strip - Unified Gov Style */}
            <div className="bg-[#6F42C1] dark:bg-[#5a32a3] text-white py-4 px-4 md:px-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs md:text-sm gap-4">
                    <div className="opacity-90 text-center md:text-left">
                        {t.copyright}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 opacity-90">
                        <a href="#" className="hover:underline">{t.terms}</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline">{t.privacy}</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline">{t.hyperlink}</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline">{t.copyrightPol}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;