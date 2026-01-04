import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ChevronDown, Moon, Sun, Accessibility, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFontSize } from '../context/FontSizeContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, NavLink } from 'react-router-dom'

const Navbar = ({ onSidebarToggle, alwaysShowToggle }) => {
    const navigate = useNavigate();
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleEmployeeCornerClick = () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        navigate('/verify-employee');
    };

    return (
        <nav className={`w-full sticky top-0 z-50 shadow-md font-sans dark:shadow-gray-800 transition-all duration-300 ease-in-out`} role="navigation" aria-label="Main Navigation">
            {/* Top Bar - GIGW Compliant */}
            <div className={`bg-[#6F42C1] text-white px-4 flex justify-between items-center text-xs md:text-sm dark:bg-[#5a32a3] h-8 py-1.5 transition-all duration-300 ease-in-out`}>
                <div className="flex items-center gap-2">
                    <img src="/flag.png" alt="Indian Tricolor" className="h-4 w-auto object-contain" />
                    <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:underline font-medium flex items-center gap-1" aria-label="Government of India - External site that opens in a new window">
                        {t.govtIndia}
                    </a>
                </div>

                <div className="flex items-center gap-4 text-xs">


                    {/* Accessibility Tools */}
                    <div className="hidden sm:flex items-center gap-2 border-l border-white/40 pl-3" aria-label="Font Size Controls">
                        <button onClick={decreaseFontSize} className="hover:bg-white/10 px-1 rounded cursor-pointer" aria-label="Decrease Font Size">A-</button>
                        <button onClick={resetFontSize} className="bg-white/20 px-1.5 rounded font-bold cursor-pointer" aria-label="Reset Font Size">A</button>
                        <button onClick={increaseFontSize} className="hover:bg-white/10 px-1 rounded cursor-pointer" aria-label="Increase Font Size">A+</button>
                    </div>

                    <div className="flex items-center gap-3 border-l border-white/40 pl-3">
                        {/* Language Toggle - Mandatory GIGW Requirement */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
                            aria-label="Switch Language"
                        >
                            <Languages size={14} />
                            <span className="font-semibold">{t.switchLang}</span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="hover:bg-white/10 p-1 rounded-full transition-colors cursor-pointer"
                            aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        </button>

                        <button className="flex items-center gap-1 hover:underline font-medium" aria-label="Accessibility Options">
                            <Accessibility size={14} />
                            <span className="hidden sm:inline">{t.accessibility}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Bar */}
            <div className="bg-white dark:bg-gray-900 py-2 px-4 md:px-6 lg:px-12 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="flex items-center gap-3 md:gap-5">
                    {/* Sidebar Toggle Button */}
                    {onSidebarToggle && (
                        <button
                            onClick={onSidebarToggle}
                            className={`${alwaysShowToggle ? '' : 'lg:hidden'} p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md`}
                            aria-label="Toggle Sidebar"
                        >
                            <Menu size={24} />
                        </button>
                    )}
                    <img src="/embelem.png" alt="State Emblem of India" className="h-10 md:h-14 object-contain brightness-100 dark:invert" />
                    <div className="h-8 md:h-10 w-[1px] bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                    <div onClick={() => navigate('/')} className="cursor-pointer flex flex-col">
                        <img src="/logo.png" alt="MCD Logo" className="h-8 md:h-10 object-contain" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 hidden md:block">नगर निगम दिल्ली</span>
                    </div>
                </div>

                {/* Desktop Nav - Focused on "Online Services" */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 dark:text-gray-200 text-sm xl:text-base">
                    {/* Common NavLink Stylings */}
                    {[
                        { to: "/notices", label: t.publicNotices },
                        { to: "/recruitment", label: t.recruitmentPortal },
                        {
                            to: "/verify-employee",
                            label: t.employeeCorner,
                            onClick: (e) => {
                                if (!isSignedIn) {
                                    e.preventDefault();
                                    openSignIn();
                                }
                            }
                        },
                        { to: "/about-us", label: t.aboutUs }
                    ].map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            onClick={link.onClick}
                            className={({ isActive }) => `transition-colors py-1 border-b-2 ${isActive
                                ? 'text-[#6F42C1] dark:text-[#a074f0] border-[#6F42C1] dark:border-[#a074f0] font-semibold'
                                : 'border-transparent hover:text-[#6F42C1] dark:hover:text-[#a074f0] hover:border-[#6F42C1] dark:hover:border-[#a074f0]'
                                }`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    {/* Dev Mode - Highlighted */}
                    <NavLink
                        to="/developer-mode"
                        className={({ isActive }) => `relative transition-colors py-1 border-b-2 ${isActive
                            ? 'text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400 font-bold'
                            : 'border-transparent text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 hover:border-orange-500 font-semibold'
                            }`}
                    >
                        <span className="flex items-center gap-1.5">
                            Dev Mode
                            <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Beta</span>
                        </span>
                    </NavLink>
                </div>

                {/* Actions - Grouped for Clarity */}
                <div className="hidden lg:flex items-center gap-4">

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="cursor-pointer px-5 py-2 border border-[#6F42C1] text-[#6F42C1] dark:border-[#a074f0] dark:text-[#a074f0] rounded-lg font-semibold text-sm hover:bg-purple-50 dark:hover:bg-opacity-10 transition-colors">
                                {t.login}
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="cursor-pointer px-5 py-2 bg-[#6F42C1] dark:bg-[#5a32a3] text-white rounded-lg font-semibold text-sm hover:bg-[#5a32a3] dark:hover:bg-[#4a2885] transition-colors shadow-md">
                                {t.signup}
                            </button>
                        </SignUpButton>
                    </SignedOut>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 z-50 flex flex-col p-4 gap-4 transition-all duration-300 text-gray-800 dark:text-gray-100">

                    <a href="" className="font-medium py-3 border-b border-gray-50 dark:border-gray-800 flex justify-between">{t.onlineServices} <ChevronDown size={16} /></a>
                    <NavLink to="/notices" className={({ isActive }) => `font-medium py-3 border-b border-gray-50 dark:border-gray-800 ${isActive ? 'text-[#6F42C1] dark:text-[#a074f0] bg-purple-50 dark:bg-purple-900/20 pl-2 rounded-r' : ''}`}>{t.publicNotices}</NavLink>
                    <div onClick={handleEmployeeCornerClick} className="font-medium py-3 border-b border-gray-50 dark:border-gray-800 flex justify-between cursor-pointer">{t.employeeCorner} <ChevronDown size={16} /></div>
                    <NavLink to="/about-us" className={({ isActive }) => `font-medium py-3 border-b border-gray-50 dark:border-gray-800 transition-all ${isActive ? 'text-[#6F42C1] dark:text-[#a074f0] bg-purple-50 dark:bg-purple-900/20 pl-2 rounded-r' : 'hover:pl-2'}`}>{t.aboutUs}</NavLink>
                    {/* Dev Mode in Mobile */}
                    <NavLink to="/developer-mode" className={({ isActive }) => `font-bold py-3 border-b border-gray-50 dark:border-gray-800 transition-all flex items-center gap-2 ${isActive ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 pl-2 rounded-r' : 'text-orange-500 dark:text-orange-400 hover:pl-2'}`}>
                        Dev Mode <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-bold">BETA</span>
                    </NavLink>
                    <div className="flex flex-col gap-3 mt-4">
                        <SignedIn>
                            <div className="flex justify-start px-2">
                                <UserButton />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full cursor-pointer py-3 border border-[#6F42C1] text-[#6F42C1] dark:border-[#a074f0] dark:text-[#a074f0] rounded-lg font-bold">
                                    {t.login}
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="w-full cursor-pointer py-3 bg-[#6F42C1] dark:bg-[#5a32a3] text-white rounded-lg font-bold">
                                    {t.signup}
                                </button>
                            </SignUpButton>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;