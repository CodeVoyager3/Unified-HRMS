import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import {
  Search, Home, Zap, CheckCircle, BarChart3, Settings, Users, Briefcase,
  Clock, Building2, TrendingUp, TrendingDown, User, FileText, Activity,
  Bell, ChevronRight, Calendar, MapPin, ArrowUpRight, Menu, X
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState('Overview');

  // Stats data with purple theme colors
  const stats = [
    {
      title: language === 'en' ? 'TOTAL EMPLOYEES' : 'कुल कर्मचारी',
      value: '1,50,847',
      change: '+2.5%',
      trend: 'up',
      icon: Users,
      color: '#6F42C1'
    },
    {
      title: language === 'en' ? 'ACTIVE VACANCIES' : 'सक्रिय रिक्तियां',
      value: '324',
      change: '-18%',
      trend: 'down',
      icon: Briefcase,
      color: '#14b8a6'
    },
    {
      title: language === 'en' ? 'PENDING APPROVALS' : 'लंबित अनुमोदन',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: Clock,
      color: '#f59e0b'
    },
    {
      title: language === 'en' ? 'GRIEVANCES RESOLVED' : 'शिकायतें निपटाई गईं',
      value: '89.5%',
      change: '+5.2%',
      trend: 'up',
      icon: CheckCircle,
      color: '#10b981'
    },
  ];

  // Hiring/Recruitment trend data
  const hiringTrendData = [
    { month: 'Jan', hired: 120, transfers: 45 },
    { month: 'Feb', hired: 145, transfers: 52 },
    { month: 'Mar', hired: 180, transfers: 38 },
    { month: 'Apr', hired: 165, transfers: 61 },
    { month: 'May', hired: 210, transfers: 48 },
    { month: 'Jun', hired: 195, transfers: 55 },
    { month: 'Jul', hired: 230, transfers: 42 },
    { month: 'Aug', hired: 245, transfers: 67 },
    { month: 'Sep', hired: 198, transfers: 51 },
    { month: 'Oct', hired: 215, transfers: 58 },
    { month: 'Nov', hired: 178, transfers: 44 },
    { month: 'Dec', hired: 156, transfers: 39 },
  ];

  // Department distribution data
  const departmentData = [
    { name: language === 'en' ? 'Sanitation' : 'स्वच्छता', value: 42000, color: '#6F42C1' },
    { name: language === 'en' ? 'Engineering' : 'अभियांत्रिकी', value: 35000, color: '#8b5cf6' },
    { name: language === 'en' ? 'Health' : 'स्वास्थ्य', value: 28000, color: '#a074f0' },
    { name: language === 'en' ? 'Education' : 'शिक्षा', value: 25000, color: '#c4b5fd' },
  ];

  // Pending approvals data
  const pendingApprovals = [
    {
      name: "Dr. Ankit Sharma",
      empId: "MCD-2024-1542",
      from: "Rohini Zone",
      type: language === 'en' ? "Transfer" : "स्थानांतरण",
      to: "Shahdara Zone",
      date: "28 Dec 2025",
      priority: "high"
    },
    {
      name: "Suman Kumari",
      empId: "MCD-2019-0847",
      from: "Civil Lines",
      type: language === 'en' ? "Promotion" : "पदोन्नति",
      to: "Senior Inspector",
      date: "27 Dec 2025",
      priority: "medium"
    },
    {
      name: "Rajesh Verma",
      empId: "MCD-2021-2156",
      from: "Najafgarh Zone",
      type: language === 'en' ? "Transfer" : "स्थानांतरण",
      to: "South Zone",
      date: "26 Dec 2025",
      priority: "low"
    },
    {
      name: "Priya Singh",
      empId: "MCD-2018-0923",
      from: "Shahdara Zone",
      type: language === 'en' ? "Promotion" : "पदोन्नति",
      to: "Deputy Manager",
      date: "25 Dec 2025",
      priority: "high"
    },
    {
      name: "Mohit Gupta",
      empId: "MCD-2022-3421",
      from: "Central Zone",
      type: language === 'en' ? "Leave" : "छुट्टी",
      to: "Medical Leave (15 days)",
      date: "24 Dec 2025",
      priority: "medium"
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      action: language === 'en' ? "New circular published" : "नया परिपत्र प्रकाशित",
      time: "2 hours ago",
      icon: FileText
    },
    {
      action: language === 'en' ? "Transfer order approved for Zone 5" : "जोन 5 के लिए स्थानांतरण आदेश स्वीकृत",
      time: "4 hours ago",
      icon: CheckCircle
    },
    {
      action: language === 'en' ? "Payroll processed for December" : "दिसंबर के लिए वेतन प्रसंस्कृत",
      time: "1 day ago",
      icon: BarChart3
    },
    {
      action: language === 'en' ? "New employee batch onboarded (45)" : "नया कर्मचारी बैच शामिल (45)",
      time: "2 days ago",
      icon: Users
    },
  ];

  // Sidebar menu items
  const menuItems = [
    { icon: Home, label: language === 'en' ? 'Overview' : 'अवलोकन', id: 'Overview' },
    { icon: Users, label: language === 'en' ? 'Employees' : 'कर्मचारी', id: 'Employees' },
    { icon: CheckCircle, label: language === 'en' ? 'Approvals' : 'अनुमोदन', id: 'Approvals' },
    { icon: Briefcase, label: language === 'en' ? 'Transfers' : 'स्थानांतरण', id: 'Transfers' },
    { icon: BarChart3, label: language === 'en' ? 'Analytics' : 'विश्लेषण', id: 'Analytics' },
    { icon: FileText, label: language === 'en' ? 'Reports' : 'रिपोर्ट', id: 'Reports' },
    { icon: Settings, label: language === 'en' ? 'Settings' : 'सेटिंग्स', id: 'Settings' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    if (type.includes('Transfer') || type.includes('स्थानांतरण')) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    } else if (type.includes('Promotion') || type.includes('पदोन्नति')) {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    } else {
      return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="flex">
        {/* Sidebar - Static */}
        <aside className="w-64 bg-[#1e1b4b] dark:bg-[#0f0d24] h-[calc(100vh-104px)] sticky top-[104px] transition-all duration-300 hidden lg:block overflow-y-auto custom-scrollbar">
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
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Welcome back! Here\'s your workforce overview.' : 'वापस स्वागत है! यहां आपका कार्यबल अवलोकन है।'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search employees...' : 'कर्मचारी खोजें...'}
                  className="w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6F42C1] dark:focus:ring-[#a074f0] transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button className="relative p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-[#6F42C1]/30 dark:hover:border-[#a074f0]/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <div className="flex items-center gap-1.5">
                        {stat.trend === 'up' ? (
                          <TrendingUp size={14} className="text-green-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-400">
                          {language === 'en' ? 'vs last month' : 'पिछले माह से'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart - Hiring Trends */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Recruitment & Transfers' : 'भर्ती और स्थानांतरण'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'Monthly overview for 2025' : '2025 के लिए मासिक अवलोकन'}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6F42C1] dark:text-[#a074f0] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                  <Activity size={16} />
                  {language === 'en' ? 'View Report' : 'रिपोर्ट देखें'}
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hiringTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="hired" name={language === 'en' ? 'Hired' : 'नियुक्त'} fill="#6F42C1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="transfers" name={language === 'en' ? 'Transfers' : 'स्थानांतरण'} fill="#a074f0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Department Distribution */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Department Distribution' : 'विभाग वितरण'}
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => value.toLocaleString()}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {departmentData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {Math.round((item.value / 130000) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row - Approvals Table & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals Table */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Pending Approvals' : 'लंबित अनुमोदन'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'Requests awaiting your action' : 'आपकी कार्रवाई की प्रतीक्षा में अनुरोध'}
                  </p>
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-[#6F42C1] dark:text-[#a074f0] hover:underline">
                  {language === 'en' ? 'View All' : 'सभी देखें'}
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {language === 'en' ? 'Employee' : 'कर्मचारी'}
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {language === 'en' ? 'Type' : 'प्रकार'}
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                        {language === 'en' ? 'Details' : 'विवरण'}
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">
                        {language === 'en' ? 'Date' : 'तारीख'}
                      </th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {language === 'en' ? 'Action' : 'कार्रवाई'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6F42C1] to-[#a074f0] flex items-center justify-center text-white font-semibold text-sm">
                              {row.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{row.name}</p>
                              <p className="text-xs text-gray-400">{row.empId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(row.type)}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{row.from}</p>
                          <p className="text-xs text-gray-400">→ {row.to}</p>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                          {row.date}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="px-4 py-1.5 text-sm font-medium text-[#6F42C1] dark:text-[#a074f0] border border-[#6F42C1] dark:border-[#a074f0] rounded-lg hover:bg-[#6F42C1] hover:text-white dark:hover:bg-[#a074f0] dark:hover:text-white transition-colors">
                            {language === 'en' ? 'Review' : 'समीक्षा'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="w-9 h-9 rounded-lg bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 flex items-center justify-center flex-shrink-0">
                      <activity.icon size={18} className="text-[#6F42C1] dark:text-[#a074f0]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-200">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 text-sm font-medium text-[#6F42C1] dark:text-[#a074f0] border border-[#6F42C1]/20 dark:border-[#a074f0]/20 rounded-lg hover:bg-[#6F42C1]/5 dark:hover:bg-[#a074f0]/10 transition-colors">
                {language === 'en' ? 'View All Activity' : 'सभी गतिविधि देखें'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;