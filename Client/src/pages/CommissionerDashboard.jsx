import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
  Home, CheckCircle, BarChart3, Users, Briefcase,
  FileText, Activity, Search, Bell, LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

import Overview from '../components/dashboard/Overview';
import Notices from '../components/dashboard/Notices';
import Transfers from '../components/dashboard/Transfers';
import Approvals from '../components/dashboard/Approvals';
import Employees from '../components/dashboard/Employees';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const { signOut } = useClerk();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Sidebar menu items
  const menuItems = [
    { icon: Home, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
    { icon: FileText, label: language === 'en' ? 'Notices' : 'सूचनाएं', id: 'Notices' },
    { icon: Briefcase, label: language === 'en' ? 'Transfers' : 'स्थानांतरण', id: 'Transfers' },
    { icon: CheckCircle, label: language === 'en' ? 'Approvals' : 'अनुमोदन', id: 'Approvals' },
    { icon: Users, label: language === 'en' ? 'Deputy Commissioners' : 'कनिष्ठ कर्मचारी', id: 'DeputyCommissioners' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return <Overview language={language} />;
      case 'Notices':
        return <Notices language={language} />;
      case 'Transfers':
        return <Transfers language={language} />;
      case 'Approvals':
        return <Approvals language={language} />;
      case 'DeputyCommissioners':
        return <Employees language={language} />;
      default:
        return <Overview language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar onSidebarToggle={toggleSidebar} />

      <div className="flex">
        {/* Sidebar - Static */}
        <aside className={`
          w-64 bg-[#1e1b4b] dark:bg-[#0f0d24] h-[calc(100vh-104px)] 
          fixed lg:sticky top-[104px] left-0 transition-transform duration-300 z-40 overflow-y-auto custom-scrollbar
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            {/* Logo/Title */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-[#6F42C1] flex items-center justify-center flex-shrink-0">
                <Activity className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">MCD Admin</h2>
                <p className="text-gray-400 text-xs">{language === 'en' ? 'Control Panel' : 'नियंत्रण कक्ष'}</p>
              </div>
            </div>

            {/* Workspace Selector */}
            <div className="mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider px-2 mb-2">
                {language === 'en' ? 'Workspace' : 'कार्यक्षेत्र'}
              </p>
              <div className="bg-[#2d2a5e] rounded-xl p-3 cursor-pointer hover:bg-[#3d3a7e] transition-colors">
                <p className="text-white font-semibold text-sm">{language === 'en' ? 'Commissioner Office' : 'आयुक्त कार्यालय'}</p>
                <p className="text-gray-400 text-xs">{language === 'en' ? 'Admin Access' : 'व्यवस्थापक पहुंच'}</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${activeMenu === item.id
                    ? 'bg-[#6F42C1] text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-400 hover:bg-[#2d2a5e] hover:text-white'
                    }`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-4"
              >
                <LogOut size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{language === 'en' ? 'Logout' : 'लॉग आउट'}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}


          {/* Dynamic Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;