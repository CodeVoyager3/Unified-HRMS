import { useState } from 'react';
import { Search, ChevronDown, Moon, Accessibility, Menu, X, Languages } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState('English');

    return (
        <nav className="w-full relative shadow-md font-sans" role="navigation" aria-label="Main Navigation">
            {/* Top Bar - GIGW Compliant */}
            <div className="bg-[#6F42C1] text-white px-4 py-1.5 flex justify-between items-center text-xs md:text-sm">
                <div className="flex items-center gap-2">
                    <img src="/flag.png" alt="Indian Tricolor" className="h-4 w-auto object-contain" />
                    <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:underline font-medium flex items-center gap-1" aria-label="Government of India - External site that opens in a new window">
                        भारत सरकार | Government of India
                    </a>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <a href="#main" className="hover:underline hidden lg:block font-medium">Skip to Main Content</a>

                    {/* Accessibility Tools */}
                    <div className="hidden sm:flex items-center gap-2 border-l border-white/40 pl-3" aria-label="Font Size Controls">
                        <button className="hover:bg-white/10 px-1 rounded" aria-label="Decrease Font Size">A-</button>
                        <button className="bg-white/20 px-1.5 rounded font-bold" aria-label="Reset Font Size">A</button>
                        <button className="hover:bg-white/10 px-1 rounded" aria-label="Increase Font Size">A+</button>
                    </div>

                    <div className="flex items-center gap-3 border-l border-white/40 pl-3">
                        {/* Language Toggle - Mandatory GIGW Requirement */}
                        <button
                            onClick={() => setLanguage(language === 'English' ? 'हिन्दी' : 'English')}
                            className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
                            aria-label="Switch Language"
                        >
                            <Languages size={14} />
                            <span className="font-semibold">{language === 'English' ? 'हिन्दी' : 'English'}</span>
                        </button>

                        <button className="hover:bg-white/10 p-1 rounded-full" aria-label="Toggle High Contrast Mode">
                            <Moon size={14} />
                        </button>

                        <button className="flex items-center gap-1 hover:underline font-medium" aria-label="Accessibility Options">
                            <Accessibility size={14} />
                            <span className="hidden sm:inline">Accessibility</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Bar */}
            <div className="bg-white py-2 px-4 md:px-6 lg:px-12 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3 md:gap-5">
                    <img src="/embelem.png" alt="State Emblem of India" className="h-10 md:h-14 object-contain" />
                    <div className="h-8 md:h-10 w-[1px] bg-gray-300 hidden sm:block"></div>
                    <div className="flex flex-col">
                        <img src="/logo.png" alt="MCD Logo" className="h-8 md:h-10 object-contain" />
                        <span className="text-[10px] font-bold text-gray-600 hidden md:block">नगर निगम दिल्ली</span>
                    </div>
                </div>

                {/* Desktop Nav - Focused on "Online Services" */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 text-sm xl:text-base">
                    <a href="#" className="hover:text-[#6F42C1] transition-colors border-b-2 border-transparent hover:border-[#6F42C1] py-1">About Us</a>
                    <button className="group flex items-center gap-1 hover:text-[#6F42C1] transition-colors cursor-pointer py-1">
                        <span>Online Services</span>
                        <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    <a href="#" className="hover:text-[#6F42C1] transition-colors py-1">Public Notices</a>
                    <button className="group flex items-center gap-1 hover:text-[#6F42C1] transition-colors cursor-pointer py-1">
                        <span>Employee Corner</span>
                        <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                </div>

                {/* Actions - Grouped for Clarity */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#6F42C1] w-40 xl:w-56 transition-all"
                        />
                        <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button className="px-5 py-2 border border-[#6F42C1] text-[#6F42C1] rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors">
                        Login
                    </button>
                    <button className="px-5 py-2 bg-[#6F42C1] text-white rounded-lg font-semibold text-sm hover:bg-[#5a32a3] transition-colors shadow-md">
                        Sign Up
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 flex flex-col p-4 gap-4 transition-all duration-300">
                    <div className="relative mb-2">
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none" />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <a href="#" className="text-gray-700 font-medium py-3 border-b border-gray-50 hover:pl-2 transition-all">About Us</a>
                    <a href="#" className="text-gray-700 font-medium py-3 border-b border-gray-50 flex justify-between">Online Services <ChevronDown size={16} /></a>
                    <a href="#" className="text-gray-700 font-medium py-3 border-b border-gray-50">Public Notices</a>
                    <a href="#" className="text-gray-700 font-medium py-3 border-b border-gray-50 flex justify-between">Employee Corner <ChevronDown size={16} /></a>

                    <div className="flex flex-col gap-3 mt-4">
                        <button className="w-full py-3 border border-[#6F42C1] text-[#6F42C1] rounded-lg font-bold">Login</button>
                        <button className="w-full py-3 bg-[#6F42C1] text-white rounded-lg font-bold">Sign Up</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;