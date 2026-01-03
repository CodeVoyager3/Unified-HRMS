import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { useClerk } from '@clerk/clerk-react';
import {
  PieChart as ChartIcon, Users, AlertCircle, Star, LogOut, LayoutDashboard,
  ClipboardCheck, BadgeIndianRupee
} from 'lucide-react';

// Import Dashboard Components
import SIOverview from '../components/dashboard/SIOverview';
import SIAttendanceMonitor from '../components/inspector/SIAttendanceMonitor';
import SIPerformancePayroll from '../components/inspector/SIPerformancePayroll';
import SIIssueTracker from '../components/inspector/SIIssueTracker';
import SIEnforcement from '../components/inspector/SIEnforcement';
import SIWeeklyCredits from '../components/inspector/SIWeeklyCredits';

const SanitaryInspectorDashboard = () => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const { signOut } = useClerk();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('verifiedUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: LayoutDashboard, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
    { icon: ClipboardCheck, label: language === 'en' ? 'Attendance Monitor' : 'उपस्थिति निगरानी', id: 'Attendance' },
    { icon: BadgeIndianRupee, label: language === 'en' ? 'Performance & Payroll' : 'प्रदर्शन और वेतन', id: 'Payroll' },
    { icon: AlertCircle, label: language === 'en' ? 'Issue Tracker' : 'मुद्दा ट्रैकर', id: 'Issues' },
    { icon: Star, label: language === 'en' ? 'Credit System' : 'क्रेडिट सिस्टम', id: 'Credits' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return <SIOverview language={language} currentUser={userData} setActiveMenu={setActiveMenu} />;
      case 'Attendance':
        return <SIAttendanceMonitor language={language} currentUser={userData} />;
      case 'Payroll':
        return <SIPerformancePayroll language={language} currentUser={userData} />;
      case 'Enforcement':
        return <SIEnforcement language={language} currentUser={userData} />;
      case 'Issues':
        return <SIIssueTracker language={language} currentUser={userData} />;
      case 'Credits':
        return <SIWeeklyCredits language={language} currentUser={userData} />;
      default:
        return <SIOverview language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-inter">
      <Navbar onSidebarToggle={toggleSidebar} alwaysShowToggle={true} />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          bg-white dark:bg-[#0f0d24] h-[calc(100vh-104px)] 
          fixed lg:sticky top-[104px] left-0 z-40 overflow-y-auto custom-scrollbar
          border-r border-gray-200 dark:border-white/5
          transition-[width,transform] duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
        `}>
          <div className="p-4 flex flex-col h-full">
            {/* Identity */}
            <div className={`flex items-center gap-3 mb-6 ${isSidebarOpen ? 'px-2' : 'justify-center px-0'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                <ChartIcon className="text-white" size={22} />
              </div>
              <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg leading-tight whitespace-nowrap">MCD Inspector</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{language === 'en' ? 'Sanitation Panel' : 'निरीक्षक कक्ष'}</p>
              </div>
            </div>

            {/* Workspace Info - Hide in Mini Mode */}
            {isSidebarOpen && (
              <div className="mb-6 px-2 animate-in fade-in duration-300">
                <div className="bg-gray-50 dark:bg-[#2d2a5e]/50 border border-gray-200 dark:border-white/5 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                    {language === 'en' ? 'Active Zone' : 'सक्रिय क्षेत्र'}
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {userData?.Ward
                      ? (language === 'en' ? `Ward ${userData.Ward} - ${userData.Zone || 'General'}` : `वार्ड ${userData.Ward} - ${userData.Zone || 'सामान्य'}`)
                      : (language === 'en' ? 'Loading...' : 'लोड हो रहा है...')}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  title={!isSidebarOpen ? item.label : ''}
                  className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-300 group ${activeMenu === item.id
                    ? 'bg-gradient-to-r from-[#6F42C1] to-[#5a35a0] text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={`flex-shrink-0 transition-transform duration-300 ${activeMenu === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-medium transition-all duration-200 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                    {item.label}
                  </span>
                  {activeMenu === item.id && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>
              ))}
            </nav>

            <div className={`mt-auto pt-4 border-t border-gray-200 dark:border-white/10 ${isSidebarOpen ? '' : 'flex justify-center'}`}>
              <button
                onClick={() => signOut()}
                title={!isSidebarOpen ? (language === 'en' ? 'Logout' : 'लॉग आउट') : ''}
                className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200`}
              >
                <LogOut size={20} className="flex-shrink-0" />
                <span className={`text-sm font-medium transition-all duration-200 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                  {language === 'en' ? 'Logout' : 'लॉग आउट'}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SanitaryInspectorDashboard;