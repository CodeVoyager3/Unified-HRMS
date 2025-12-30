import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full font-sans">
            {/* Main Footer Section */}
            <div className="bg-white pt-12 pb-8 px-4 md:px-8 lg:px-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 justify-between">

                    {/* Left Section (Column 1) - Brand & Social */}
                    <div className="flex-shrink-0 lg:w-1/4">
                        <div className="mb-6">
                            {/* Brand Logo Placeholder */}
                            <div className="h-16 w-48 bg-gray-200 flex items-center justify-center rounded-md mb-4 text-gray-500 font-bold border border-gray-300">
                                Brand Logo
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Empowering citizens through seamless digital governance and innovative technology solutions.
                                Building a transparent, accessible, and future-ready Digital India for every individual.
                            </p>

                            {/* Social Icons - Official Handles */}
                            <div className="flex gap-3">
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter (X)"
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all duration-300 shadow-sm">
                                    <Twitter size={18} />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-sm">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section (Columns 2-5) - Categories */}
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8 lg:px-6">
                        {/* Category 1: Services */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Services</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['Smart Governance', 'Digital Identity', 'Cloud Services', 'Data Analytics', 'Cyber Security'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6341f2] transition-colors hover:underline decoration-[#6341f2] underline-offset-4">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Category 2: Resources */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Resources</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['Annual Reports', 'API Documentation', 'User Manuals', 'Policy Papers', 'Open Data'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6341f2] transition-colors hover:underline decoration-[#6341f2] underline-offset-4">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Category 3: Quick Links */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['About Us', 'Careers', 'Media Gallery', 'Latest News', 'Tenders'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6341f2] transition-colors hover:underline decoration-[#6341f2] underline-offset-4">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Category 4: Support */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['Help Desk', 'Contact Us', 'Feedback', 'FAQs', 'Site Map'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-[#6341f2] transition-colors hover:underline decoration-[#6341f2] underline-offset-4">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Far Right Section - NeGD & Digital India */}
                    <div className="flex-shrink-0 lg:w-1/5 flex flex-col items-start lg:items-end space-y-6">
                        <div className="flex flex-col items-start lg:items-end w-full">
                            <span className="text-xs font-semibold text-gray-400 uppercase mb-3">Developed By</span>
                            <div className="flex flex-col gap-4 items-start lg:items-end">
                                {/* NeGD Logo */}
                                <div className="h-14 w-40 bg-white border border-gray-200 rounded p-2 flex items-center justify-center hover:shadow-md transition-shadow">
                                    <img
                                        src="https://negd.gov.in/sites/default/files/2022-09/NeGD-Logo_0.png"
                                        alt="NeGD Logo"
                                        className="h-full w-auto object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerText = 'NeGD Logo';
                                            e.target.parentNode.classList.add('text-xs', 'font-bold', 'text-gray-500', 'bg-gray-100');
                                        }}
                                    />
                                </div>
                                {/* Digital India Logo */}
                                <div className="h-14 w-40 bg-white border border-gray-200 rounded p-2 flex items-center justify-center hover:shadow-md transition-shadow">
                                    <img
                                        src="https://digitalindia.gov.in/assets/images/digital-india-logo.png"
                                        alt="Digital India Logo"
                                        className="h-full w-auto object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerText = 'Digital India';
                                            e.target.parentNode.classList.add('text-xs', 'font-bold', 'text-gray-500', 'bg-gray-100');
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-4 leading-tight font-medium text-left lg:text-right">
                                Ministry of Electronics &<br /> Information Technology,<br /> Government of India
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-[#6341f2] text-white py-4 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs md:text-sm gap-2">
                    <div className="opacity-90 text-center md:text-left">
                        © 2025 - Copyright UX4G. All rights reserved. Powered by NeGD
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 opacity-90">
                        <a href="#" className="hover:underline whitespace-nowrap">Terms & Conditions</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline whitespace-nowrap">Privacy Policy</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline whitespace-nowrap">Hyperlinking Policy</a>
                        <span className="hidden sm:block h-3 w-px bg-white/40"></span>
                        <a href="#" className="hover:underline whitespace-nowrap">Disclaimer</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
