import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
  Home, CheckCircle, BarChart3, Users, Briefcase,
  FileText, Activity, LogOut, MapPin, DollarSign, Package,
  MessageSquare, TrendingUp
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

// Import existing components
import Overview from '../components/dashboard/Overview';
import Notices from '../components/dashboard/Notices';
import Transfers from '../components/dashboard/Transfers';
import Approvals from '../components/dashboard/Approvals';
import Employees from '../components/dashboard/Employees';

// Import new Commissioner components
import CityWideOverview from '../components/commissioner/CityWideOverview';
import ZonePerformanceAnalytics from '../components/commissioner/ZonePerformanceAnalytics';
import ApprovalCenter from '../components/commissioner/ApprovalCenter';
import GrievanceMonitoring from '../components/commissioner/GrievanceMonitoring';
import FinancialOverview from '../components/commissioner/FinancialOverview';
import InventoryManagement from '../components/commissioner/InventoryManagement';
import DCManagement from '../components/commissioner/DCManagement';

const CommissionerDashboard = () => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState('CityOverview');
  const { signOut } = useClerk();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('verifiedUser');
    if (!storedUser) {
      navigate('/verify-employee');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        // RBAC: Strict Role Check
        if (parsedUser.role !== 'Commissioner') {
          console.warn("Unauthorized access attempt: Role mismatch");
          navigate('/verify-employee');
        }
      } catch (e) {
        navigate('/verify-employee');
      }
    }
  }, [navigate]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Enhanced menu structure
  const menuItems = [
    { icon: Home, label: language === 'en' ? 'City Overview' : 'शहर अवलोकन', id: 'CityOverview' },
    { icon: MapPin, label: language === 'en' ? 'Zone Analytics' : 'क्षेत्र विश्लेषण', id: 'ZoneAnalytics' },
    { icon: CheckCircle, label: language === 'en' ? 'Approvals' : 'अनुमोदन', id: 'ApprovalCenter' },
    { icon: MessageSquare, label: language === 'en' ? 'Grievances' : 'शिकायतें', id: 'Grievances' },
    { icon: DollarSign, label: language === 'en' ? 'Financial' : 'वित्तीय', id: 'Financial' },
    { icon: Package, label: language === 'en' ? 'Inventory' : 'सामग्री', id: 'Inventory' },
    { icon: Users, label: language === 'en' ? 'Deputy Commissioners' : 'उप आयुक्त', id: 'DCManagement' },
    { icon: FileText, label: language === 'en' ? 'Notices' : 'सूचनाएं', id: 'Notices' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'CityOverview':
        return <CityWideOverview language={language} onNavigate={setActiveMenu} />;
      case 'ZoneAnalytics':
        return <ZonePerformanceAnalytics language={language} />;
      case 'ApprovalCenter':
        return <ApprovalCenter language={language} />;
      case 'Grievances':
        return <GrievanceMonitoring language={language} />;
      case 'Financial':
        return <FinancialOverview language={language} />;
      case 'Inventory':
        return <InventoryManagement language={language} />;
      case 'DCManagement':
        return <DCManagement language={language} />;
      case 'Notices':
        return <Notices language={language} />;
      case 'Transfers':
        return <Transfers language={language} />;
      case 'OldApprovals':
        return <Approvals language={language} />;
      case 'Employees':
        return <Employees language={language} />;
      default:
        return <CityWideOverview language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar onSidebarToggle={toggleSidebar} alwaysShowToggle={true} />

      <div className="flex">
        {/* Sidebar - Enhanced Design */}
        <aside className={`
          bg-white dark:bg-[#0f0d24] h-screen
          fixed lg:sticky left-0 z-40 overflow-y-auto custom-scrollbar
          border-r border-gray-200 dark:border-white/5
          transition-[width,transform,top,height] duration-300 ease-in-out
          ${isScrolled ? 'top-[72px] h-[calc(100vh-72px)]' : 'top-[104px] h-[calc(100vh-104px)]'}
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
        `}>
          <div className="p-4 flex flex-col h-full">
            {/* Logo/Title */}
            <div className={`flex items-center gap-3 mb-6 ${isSidebarOpen ? 'px-2' : 'justify-center px-0'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                <Activity className="text-white" size={22} />
              </div>
              <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg leading-tight whitespace-nowrap">MCD Commissioner</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड'}</p>
              </div>
            </div>

            {/* Workspace Selector */}
            {isSidebarOpen && (
              <div className="mb-6 px-2 animate-in fade-in duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                  {language === 'en' ? 'Workspace' : 'कार्यक्षेत्र'}
                </p>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">{language === 'en' ? 'Commissioner Office' : 'आयुक्त कार्यालय'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{language === 'en' ? 'City-wide Access' : 'शहर-व्यापी पहुंच'}</p>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <nav className="space-y-1 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  title={!isSidebarOpen ? item.label : ''}
                  className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-300 group ${activeMenu === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
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

            {/* Logout Button */}
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommissionerDashboard;