import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
  Home, ShieldAlert, ArrowRightLeft, MessageSquare, BarChart3,
  Activity, Search, Bell, LogOut, LayoutDashboard, Map as MapIcon
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

import DelhiZoneMap from '../components/dashboard/DelhiZoneMap';
import WardProgressMap from '../components/deputy/WardProgressMap';
import DisciplinaryAction from '../components/deputy/DisciplinaryAction';
import InterZoneTransfers from '../components/deputy/InterZoneTransfers';
import ZoneGrievance from '../components/deputy/ZoneGrievance';
import Overview from '../components/dashboard/Overview';

const DeputyCommissionerDashboard = () => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const { signOut } = useClerk();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get DC's assigned zone from sessionStorage (simulated from verification)
  const [dcZone, setDcZone] = useState('Rohini Zone');

  useEffect(() => {
    const storedData = sessionStorage.getItem('verifiedUser');
    if (!storedData) {
      navigate('/verify-employee');
    } else {
      try {
        const userData = JSON.parse(storedData);
        // RBAC: Strict Role Check
        if (userData.role !== 'Deputy Commissioner') {
          console.warn("Unauthorized access attempt: Role mismatch");
          navigate('/verify-employee');
          return;
        }

        if (userData.Zone) {
          // Normalize zone name to match our database (e.g., "Rohini" -> "Rohini Zone")
          const normalizedZone = userData.Zone.includes('Zone') ? userData.Zone : `${userData.Zone} Zone`;
          setDcZone(normalizedZone);
        }
      } catch (e) {
        navigate('/verify-employee');
      }
    }
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Sidebar menu items for Deputy Commissioner
  const menuItems = [
    { icon: Home, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
    { icon: MapIcon, label: language === 'en' ? 'Ward Progress' : 'वार्ड प्रगति', id: 'WardProgress' },
    { icon: ShieldAlert, label: language === 'en' ? 'Disciplinary' : 'अनुशासनात्मक', id: 'Disciplinary' },
    { icon: ArrowRightLeft, label: language === 'en' ? 'Transfers' : 'स्थानांतरण', id: 'Transfers' },
    { icon: MessageSquare, label: language === 'en' ? 'Grievances' : 'शिकायतें', id: 'Grievances' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return <Overview language={language} />;
      case 'WardProgress':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {language === 'en' ? 'Ward-wise Progress' : 'वार्ड-वार प्रगति'}
                </h2>
                <p className="text-sm text-gray-500">{dcZone}</p>
              </div>
            </div>
            <WardProgressMap language={language} userZone={dcZone} />
          </div>
        );
      case 'Disciplinary':
        return <DisciplinaryAction language={language} />;
      case 'Transfers':
        return <InterZoneTransfers language={language} />;
      case 'Grievances':
        return <ZoneGrievance language={language} />;
      default:
        return <Overview language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-inter">
      <Navbar onSidebarToggle={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-[#1e1b4b] dark:bg-[#0f0d24] h-[calc(100vh-104px)] 
          fixed lg:sticky top-[104px] left-0 transition-transform duration-300 z-40 overflow-y-auto custom-scrollbar
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            {/* Context Logo */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <ShieldAlert className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">MCD Deputy</h2>
                <p className="text-gray-400 text-xs">{language === 'en' ? 'Comm. Panel' : 'आयुक्त पैनल'}</p>
              </div>
            </div>

            {/* Workspace Selector */}
            <div className="mb-6 px-2">
              <div className="bg-[#2d2a5e]/50 border border-white/5 rounded-xl p-3">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                  {language === 'en' ? 'Designation' : 'पद'}
                </p>
                <p className="text-white font-semibold text-sm">
                  {language === 'en' ? 'Deputy Commissioner' : 'उपायुक्त'}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${activeMenu === item.id
                    ? 'bg-gradient-to-r from-[#6F42C1] to-[#5a35a0] text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={`flex-shrink-0 transition-transform duration-300 ${activeMenu === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeMenu === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                  <LogOut size={20} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{language === 'en' ? 'Logout' : 'लॉग आउट'}</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeputyCommissionerDashboard;