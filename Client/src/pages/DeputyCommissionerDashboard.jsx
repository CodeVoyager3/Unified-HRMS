import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
    LayoutDashboard, Users, MapPin, ShieldAlert, ArrowRightLeft, MessageSquare,
    LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

import WardProgressMap from '../components/deputy/WardProgressMap';
import DisciplinaryAction from '../components/deputy/DisciplinaryAction';
import InterZoneTransfers from '../components/deputy/InterZoneTransfers';
import ZoneGrievance from '../components/deputy/ZoneGrievance';
import DCRecruitment from '../components/deputy/DCRecruitment';

const DeputyCommissionerDashboard = () => {
    const { language } = useLanguage();
    const [activeMenu, setActiveMenu] = useState('Overview');
    const { signOut } = useClerk();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [dcZone, setDcZone] = useState('Rohini Zone');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('verifiedUser');
        if (!storedData) {
            navigate('/verify-employee');
        } else {
            try {
                const parsedUser = JSON.parse(storedData);
                // RBAC: Strict Role Check
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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { icon: LayoutDashboard, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
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
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: language === 'en' ? 'Total Wards' : 'कुल वार्ड', value: '12', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
                                { label: language === 'en' ? 'Active Staff' : 'सक्रिय कर्मचारी', value: '248', icon: Users, color: 'from-purple-500 to-pink-500' },
                                { label: language === 'en' ? 'Pending Approvals' : 'लंबित अनुमोदन', value: '15', icon: ShieldAlert, color: 'from-amber-500 to-orange-500' },
                                { label: language === 'en' ? 'Zone Performance' : 'क्षेत्र प्रदर्शन', value: '87%', icon: LayoutDashboard, color: 'from-emerald-500 to-green-500' },
                            ].map((stat, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                                        <stat.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {language === 'en' ? 'Zone Management Dashboard' : 'क्षेत्र प्रबंधन डैशबोर्ड'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {language === 'en'
                                    ? `Managing operations for ${dcZone} with jurisdiction over all ward-level activities, staff management, and service delivery.`
                                    : `${dcZone} के लिए संचालन का प्रबंधन - सभी वार्ड स्तरीय गतिविधियों, कर्मचारी प्रबंधन और सेवा वितरण पर अधिकार क्षेत्र।`}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveMenu('Recruitment')}
                                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all text-left border border-purple-100 dark:border-purple-800">
                                    <Users className="mb-2 text-purple-600 dark:text-purple-400" size={20} />
                                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Recruitment Approvals' : 'भर्ती अनुमोदन'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'en' ? '5 pending applications' : '5 लंबित आवेदन'}</p>
                                </button>
                                <button
                                    onClick={() => setActiveMenu('WardProgress')}
                                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-left border border-blue-100 dark:border-blue-800">
                                    <MapPin className="mb-2 text-blue-600 dark:text-blue-400" size={20} />
                                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Ward Inspection' : 'वार्ड निरीक्षण'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'en' ? 'Monitor 12 wards' : '12 वार्ड की निगरानी'}</p>
                                </button>
                                <button
                                    onClick={() => setActiveMenu('Grievances')}
                                    className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all text-left border border-amber-100 dark:border-amber-800">
                                    <MessageSquare className="mb-2 text-amber-600 dark:text-amber-400" size={20} />
                                    <p className="font-semibold text-gray-900 dark:text-white">{language === 'en' ? 'Grievances' : 'शिकायतें'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'en' ? '8 open cases' : '8 खुले मामले'}</p>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { action: language === 'en' ? 'Approved recruitment request for Sanitation Worker' : 'स्वच्छता कार्यकर्ता के लिए भर्ती अनुरोध स्वीकृत', time: '2 hours ago', type: 'success' },
                                    { action: language === 'en' ? 'Ward inspection completed - Rohini-A, Score: 92%' : 'वार्ड निरीक्षण पूर्ण - रोहिणी-A, स्कोर: 92%', time: '5 hours ago', type: 'info' },
                                    { action: language === 'en' ? 'Inter-zone transfer request pending review' : 'अंतर-क्षेत्र स्थानांतरण अनुरोध समीक्षाधीन', time: '1 day ago', type: 'warning' },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                                            <span className="text-xs text-gray-500">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Recruitment':
                return <DCRecruitment language={language} userZone={dcZone} />;
            case 'WardProgress':
                return <WardProgressMap language={language} userZone={dcZone} />;
            case 'Disciplinary':
                return <DisciplinaryAction language={language} userZone={dcZone} />;
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
