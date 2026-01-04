import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard, Users, MapPin, ShieldAlert, ArrowRightLeft, MessageSquare,
  LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

import DCWardInspection from '../components/deputy/DCWardInspection';
import WardProgressMap from '../components/deputy/WardProgressMap';
import DCDisciplinary from '../components/deputy/DCDisciplinary';
import InterZoneTransfers from '../components/deputy/InterZoneTransfers';
import ZoneGrievance from '../components/deputy/ZoneGrievance';
import DCInspectors from '../components/deputy/DCInspectors';
import DCRecruitment from '../components/deputy/DCRecruitment';

const DeputyCommissionerDashboard = () => {
  const { language } = useLanguage();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dcZone, setDcZone] = useState(null); // Don't set default, wait for sessionStorage
  const [userData, setUserData] = useState(null);

  // Zone Statistics State
  const [zoneStats, setZoneStats] = useState({
    totalWards: 0,
    activeStaff: 0,
    pendingApprovals: 0,
    zonePerformance: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(true);

  // Security Check & Data Loading
  useEffect(() => {
    const storedData = sessionStorage.getItem('verifiedUser');
    if (!storedData) {
      navigate('/verify-employee');
    } else {
      try {
        const parsedUser = JSON.parse(storedData);
        if (parsedUser.role !== 'Deputy Commissioner') {
          console.warn("Unauthorized access: Role mismatch");
          navigate('/verify-employee');
          return;
        }
        setUserData(parsedUser);
        if (parsedUser.Zone) {
          const normalizedZone = parsedUser.Zone.includes('Zone') ? parsedUser.Zone : `${parsedUser.Zone} Zone`;
          setDcZone(normalizedZone);
        }
      } catch (e) {
        navigate('/verify-employee');
      }
    }
  }, [navigate]);

  // Fetch Zone Statistics & Trends
  useEffect(() => {
    const fetchZoneStats = async () => {
      if (!dcZone) return;
      console.log("🔍 Fetching stats for zone:", dcZone);
      setLoadingStats(true);
      setLoadingGraph(true);
      try {
        // Fetch Key Stats
        const statsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/zone-stats/${dcZone}`);
        const statsData = await statsResponse.json();
        console.log("📊 Received stats:", statsData);
        if (statsData.success) {
          setZoneStats(statsData.stats);
        }

        // Fetch Trends Graph
        const trendsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URI}/analytics/zone-trends/${dcZone}`);
        const trendsData = await trendsResponse.json();
        console.log("📈 Received trends:", trendsData);
        if (trendsData.success) {
          setPerformanceData(trendsData.trends);
        }
      } catch (error) {
        console.error("Error fetching zone stats/trends:", error);
      } finally {
        setLoadingStats(false);
        setLoadingGraph(false);
      }
    };
    fetchZoneStats();
  }, [dcZone]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
    { icon: Users, label: language === 'en' ? 'Sanitary Inspectors' : 'स्वच्छता निरीक्षक', id: 'Inspectors' },
    { icon: Users, label: language === 'en' ? 'Recruitment' : 'भर्ती अनुमोदन', id: 'Recruitment' },
    { icon: MapPin, label: language === 'en' ? 'Ward Inspection' : 'वार्ड निरीक्षण', id: 'WardProgress' },
    { icon: ShieldAlert, label: language === 'en' ? 'Disciplinary' : 'अनुशासनात्मक', id: 'Disciplinary' },
    { icon: ArrowRightLeft, label: language === 'en' ? 'Transfers' : 'स्थानांतरण', id: 'Transfers' },
    { icon: MessageSquare, label: language === 'en' ? 'Grievances' : 'शिकायतें', id: 'Grievances' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: language === 'en' ? 'Total Wards' : 'कुल वार्ड', value: loadingStats ? '...' : zoneStats.totalWards, icon: MapPin, color: '#3b82f6', gradient: 'from-blue-500 to-cyan-500' },
                { label: language === 'en' ? 'Active Staff' : 'सक्रिय कर्मचारी', value: loadingStats ? '...' : zoneStats.activeStaff, icon: Users, color: '#8b5cf6', gradient: 'from-purple-500 to-pink-500' },
                { label: language === 'en' ? 'Pending Approvals' : 'लंबित अनुमोदन', value: loadingStats ? '...' : zoneStats.pendingApprovals, icon: ShieldAlert, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
                { label: language === 'en' ? 'Zone Performance' : 'क्षेत्र प्रदर्शन', value: loadingStats ? '...' : `${zoneStats.zonePerformance}%`, icon: LayoutDashboard, color: '#10b981', gradient: 'from-emerald-500 to-green-500' },
              ].map((stat, index) => (
                <div key={index} className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 tabular-nums">{stat.value}</h3>
                      </div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon size={26} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions / Zone Management */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                {language === 'en' ? 'Zone Management' : 'क्षेत्र प्रबंधन'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveMenu('Recruitment')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Recruitment' : 'भर्ती'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {loadingStats ? '...' : (language === 'en' ? `${zoneStats.pendingRecruitment || 0} Pending Reviews` : `${zoneStats.pendingRecruitment || 0} समीक्षा लंबित`)}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveMenu('WardProgress')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Ward Inspection' : 'वार्ड निरीक्षण'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{language === 'en' ? 'Track Progress' : 'प्रगति ट्रैक करें'}</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveMenu('Grievances')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="text-amber-600 dark:text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Grievances' : 'शिकायतें'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {loadingStats ? '...' : (language === 'en' ? `${zoneStats.unresolvedGrievances || 0} Unresolved` : `${zoneStats.unresolvedGrievances || 0} अनसुलझा`)}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Graph (Replacement for Recent Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {language === 'en' ? 'Zone Performance Trends' : 'क्षेत्र प्रदर्शन रुझान'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'en' ? 'Monthly overview of compliance, grievances, and recruitment' : 'अनुपालन, शिकायतों और भर्ती का मासिक अवलोकन'}
                    </p>
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  {loadingGraph ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 animate-pulse">Loading Trends...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorGrievances" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.1} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend iconType="circle" />
                        <Area
                          type="monotone"
                          dataKey="compliance"
                          name={language === 'en' ? 'Compliance Score' : 'अनुपालन स्कोर'}
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorCompliance)"
                          strokeWidth={3}
                        />
                        <Area
                          type="monotone"
                          dataKey="grievances"
                          name={language === 'en' ? 'Active Grievances' : 'सक्रिय शिकायतें'}
                          stroke="#f59e0b"
                          fillOpacity={1}
                          fill="url(#colorGrievances)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'en' ? 'Ward Performance Overview' : 'वार्ड प्रदर्शन अवलोकन'}
                </h3>
                <WardProgressMap language={language} userZone={dcZone} />
              </div>
            </div>
          </div>
        );
      case 'Inspectors':
        return <DCInspectors language={language} userZone={dcZone} />;
      case 'Recruitment':
        return <DCRecruitment language={language} userZone={dcZone} />;
      case 'WardProgress':
        return <DCWardInspection language={language} userZone={dcZone} />;
      case 'Disciplinary':
        return <DCDisciplinary language={language} userZone={dcZone} />;
      case 'Transfers':
        return <InterZoneTransfers language={language} userZone={dcZone} />;
      case 'Grievances':
        return <ZoneGrievance language={language} userZone={dcZone} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-inter">
      <Navbar onSidebarToggle={toggleSidebar} alwaysShowToggle={true} />

      <div className="flex">
        {/* Sidebar - Matching Other Dashboards */}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <ShieldAlert className="text-white" size={22} />
              </div>
              <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg leading-tight whitespace-nowrap">MCD Deputy</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{language === 'en' ? 'Commissioner Panel' : 'आयुक्त पैनल'}</p>
              </div>
            </div>

            {/* Workspace Info - Hide in Mini Mode */}
            {isSidebarOpen && (
              <div className="mb-6 px-2 animate-in fade-in duration-300">
                <div className="bg-gray-50 dark:bg-[#2d2a5e]/50 border border-gray-200 dark:border-white/5 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                    {language === 'en' ? 'Assigned Zone' : 'निर्दिष्ट क्षेत्र'}
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {dcZone}
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

export default DeputyCommissionerDashboard;
