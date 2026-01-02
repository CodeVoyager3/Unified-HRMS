import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Banknote,
  MapPin,
  AlertCircle,
  BarChart3,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const EmployeeDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Placeholder Data
  const payrollData = [
    { month: 'Oct', amount: 45000, status: language === 'en' ? 'Paid' : 'भुगतान किया' },
    { month: 'Nov', amount: 45000, status: language === 'en' ? 'Paid' : 'भुगतान किया' },
    { month: 'Dec', amount: 48000, status: language === 'en' ? 'Processing' : 'प्रक्रिया में' },
  ];

  const performanceData = [
    { name: language === 'en' ? 'Week 1' : 'सप्ताह 1', tasks: 12, quality: 90 },
    { name: language === 'en' ? 'Week 2' : 'सप्ताह 2', tasks: 19, quality: 85 },
    { name: language === 'en' ? 'Week 3' : 'सप्ताह 3', tasks: 15, quality: 95 },
    { name: language === 'en' ? 'Week 4' : 'सप्ताह 4', tasks: 22, quality: 92 },
  ];

  

  // Sub-components for sections
  const OverviewSection = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {language === 'en' ? 'Welcome back,' : 'वापसी पर स्वागत है,'} {user?.firstName} 👋
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 mb-1">{language === 'en' ? 'Attendance Rate' : 'उपस्थिति दर'}</p>
              <h3 className="text-3xl font-bold">92%</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CalendarCheck size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-100">
            {language === 'en' ? 'Top 5% in your department' : 'आपके विभाग में शीर्ष 5%'}
          </div>
        </div>

        <div className="bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-pink-100 mb-1">{language === 'en' ? 'Next Payroll' : 'अगला वेतन'}</p>
              <h3 className="text-3xl font-bold">{language === 'en' ? 'Jan 31' : '31 जनवरी'}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Banknote size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-pink-100">
            {language === 'en' ? 'Estimated: ₹48,000' : 'अनुमानित: ₹48,000'}
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 mb-1">{language === 'en' ? 'Open Issues' : 'खुली समस्याएं'}</p>
              <h3 className="text-3xl font-bold">0</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-100">
            {language === 'en' ? 'All clear!' : 'सब ठीक है!'}
          </div>
        </div>
      </div>

      {/* Recent Activity / Chart Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">{language === 'en' ? 'Performance Overview' : 'प्रदर्शन अवलोकन'}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="quality" stroke="#8884d8" fillOpacity={1} fill="url(#colorQuality)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const PayrollSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{language === 'en' ? 'Payroll History' : 'वेतन इतिहास'}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Month' : 'महीना'}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Date' : 'दिनांक'}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Amount' : 'राशि'}</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Status' : 'स्थिति'}</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{language === 'en' ? 'Action' : 'कार्रवाई'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {payrollData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.month}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">25th {item.month}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Paid' || item.status === 'भुगतान किया'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline">
                    {language === 'en' ? 'Download Slip' : 'पर्ची डाउनलोड करें'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Attendance state
  const [employeeId, setEmployeeId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isWithinCheckInTime, setIsWithinCheckInTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check if current time is within check-in window (9 AM to 11 AM)
  const checkTimeWindow = () => {
    const now = new Date();
    setCurrentTime(now);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = 9 * 60; // 9:00 AM
    const endTimeInMinutes = 11 * 60; // 11:00 AM
    
    const withinWindow = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
    setIsWithinCheckInTime(withinWindow);
    return withinWindow;
  };

  // Update time check every minute
  useEffect(() => {
    checkTimeWindow();
    const interval = setInterval(() => {
      checkTimeWindow();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Get employee ID from email
  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URI}/verify/by-email/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`
          );
          const data = await response.json();
          if (data.success && data.user) {
            setEmployeeId(data.user.employeeId);
          }
        } catch (error) {
          console.error('Error fetching employee ID:', error);
        }
      }
    };
    fetchEmployeeId();
  }, [user]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(language === 'en' ? 'Geolocation is not supported by your browser' : 'आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है');
      return;
    }

    setIsLoadingAttendance(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLocationError(null);

        // Verify location if employee ID is available
        if (employeeId) {
          try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/verify-location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId, latitude, longitude })
            });
            const data = await response.json();
            setLocationVerified(data.isLocationVerified);
            if (!data.isLocationVerified) {
              setLocationError(data.message);
            }
          } catch (error) {
            console.error('Error verifying location:', error);
            setLocationError(language === 'en' ? 'Failed to verify location' : 'लोकेशन सत्यापित करने में विफल');
          }
        }
        setIsLoadingAttendance(false);
      },
      (error) => {
        setLocationError(
          language === 'en' 
            ? 'Unable to retrieve your location. Please enable location services.' 
            : 'आपकी लोकेशन प्राप्त करने में असमर्थ। कृपया लोकेशन सेवाएं सक्षम करें।'
        );
        setIsLoadingAttendance(false);
      }
    );
  };

  // Get attendance data for calendar
  const fetchAttendance = async (month = currentMonth, year = currentYear) => {
    if (!employeeId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/attendance/${employeeId}?month=${month + 1}&year=${year}`
      );
      const data = await response.json();
      if (data.success) {
        const statusMap = {};
        Object.keys(data.attendance).forEach(day => {
          statusMap[day] = data.attendance[day].status;
        });
        setAttendanceStatus(statusMap);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Get today's attendance
  const fetchTodayAttendance = async () => {
    if (!employeeId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/attendance/today/${employeeId}`
      );
      const data = await response.json();
      if (data.success) {
        setTodayAttendance(data.attendance);
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  };

  // Load attendance on mount and when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
      fetchTodayAttendance();
      getCurrentLocation();
    }
  }, [employeeId, currentMonth, currentYear]);

  // Handle check-in
  const handleCheckIn = async () => {
    if (!employeeId || !currentLocation) {
      alert(language === 'en' ? 'Please allow location access first' : 'कृपया पहले लोकेशन एक्सेस की अनुमति दें');
      return;
    }

    if (!isWithinCheckInTime) {
      alert(language === 'en' ? 'Attendance can only be marked between 9:00 AM and 11:00 AM' : 'उपस्थिति केवल सुबह 9:00 बजे से 11:00 बजे के बीच दर्ज की जा सकती है');
      return;
    }

    if (!locationVerified) {
      alert(language === 'en' ? 'You are not in your assigned ward. Cannot mark attendance.' : 'आप अपने निर्दिष्ट वार्ड में नहीं हैं। उपस्थिति दर्ज नहीं की जा सकती।');
      return;
    }

    setIsCheckingIn(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(language === 'en' ? 'Attendance marked successfully!' : 'उपस्थिति सफलतापूर्वक दर्ज की गई!');
        fetchTodayAttendance();
        fetchAttendance();
      } else {
        alert(data.message || (language === 'en' ? 'Failed to mark attendance' : 'उपस्थिति दर्ज करने में विफल'));
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(language === 'en' ? 'Error marking attendance' : 'उपस्थिति दर्ज करने में त्रुटि');
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Check if day is weekend
  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const recentIssues = [
    { id: 1, subject: 'Incorrect Tax Deduction', date: '2023-10-24', status: 'Resolved' },
    { id: 2, subject: 'Leave Balance Discrepancy', date: '2023-11-02', status: 'Pending' },
    { id: 3, subject: 'Hardware Request (Monitor)', date: '2023-11-10', status: 'Open' },
  ];

  const AttendanceSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{language === 'en' ? 'Attendance & Tracking' : 'उपस्थिति और ट्रैकिंग'}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-red-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">{language === 'en' ? 'Live Location Tracking' : 'लाइव लोकेशन ट्रैकिंग'}</h3>
          </div>
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative group mb-4">
            {/* Google Maps with current location */}
            {currentLocation ? (
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d${currentLocation.longitude}!3d${currentLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1709405234567!5m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader className="animate-spin text-gray-400" size={32} />
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2">
              {locationVerified ? (
                <>
                  <CheckCircle className="text-green-500" size={14} />
                  <span>{language === 'en' ? 'Location Verified' : 'लोकेशन सत्यापित'}</span>
                </>
              ) : currentLocation ? (
                <>
                  <XCircle className="text-red-500" size={14} />
                  <span>{language === 'en' ? 'Location Not Verified' : 'लोकेशन सत्यापित नहीं'}</span>
                </>
              ) : (
                <span>{language === 'en' ? 'Getting location...' : 'लोकेशन प्राप्त कर रहे हैं...'}</span>
              )}
            </div>
          </div>
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{locationError}</p>
            </div>
          )}
          {currentLocation && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {language === 'en' ? 'Coordinates: ' : 'निर्देशांक: '}
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </div>
          )}
          <button
            onClick={getCurrentLocation}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            {language === 'en' ? 'Refresh Location' : 'लोकेशन रीफ्रेश करें'}
          </button>
        </div>

        {/* Actions Section */}
        <div className="space-y-6">
          {/* Mark Attendance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">{language === 'en' ? 'Mark Attendance' : 'उपस्थिति दर्ज करें'}</h3>
              <Clock className="text-blue-500" size={20} />
            </div>
            {todayAttendance?.checkInTime ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {language === 'en' ? 'Checked In' : 'चेक इन किया गया'}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {language === 'en' ? 'Check-in Time: ' : 'चेक-इन समय: '}
                    {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
                  </p>
                  {todayAttendance.checkOutTime ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      {language === 'en' ? 'Check-out Time: ' : 'चेक-आउट समय: '}
                      {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}
                    </p>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/checkout`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ employeeId })
                          });
                          const data = await response.json();
                          if (data.success) {
                            alert(language === 'en' ? 'Check-out successful!' : 'चेक-आउट सफल!');
                            fetchTodayAttendance();
                          }
                        } catch (error) {
                          console.error('Error checking out:', error);
                        }
                      }}
                      className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      {language === 'en' ? 'Check Out' : 'चेक आउट करें'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Time Window Info */}
                <div className={`mb-4 p-3 rounded-lg border ${
                  isWithinCheckInTime 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={isWithinCheckInTime ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} size={16} />
                    <span className={`text-sm font-semibold ${
                      isWithinCheckInTime 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {language === 'en' ? 'Check-in Time Window' : 'चेक-इन समय विंडो'}
                    </span>
                  </div>
                  <p className={`text-xs ${
                    isWithinCheckInTime 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {isWithinCheckInTime 
                      ? (language === 'en' 
                          ? `Current time: ${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - You can check in now!`
                          : `वर्तमान समय: ${currentTime.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} - आप अभी चेक इन कर सकते हैं!`)
                      : (language === 'en' 
                          ? `Current time: ${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - Check-in allowed only between 9:00 AM - 11:00 AM`
                          : `वर्तमान समय: ${currentTime.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} - चेक-इन केवल सुबह 9:00 बजे से 11:00 बजे के बीच अनुमत है`)}
                  </p>
                </div>

                <p className={`text-sm mb-6 ${locationVerified && isWithinCheckInTime ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {locationVerified && isWithinCheckInTime
                    ? (language === 'en' ? 'Your location is verified. You can now mark your attendance.' : 'आपकी लोकेशन सत्यापित है। अब आप अपनी उपस्थिति दर्ज कर सकते हैं।')
                    : !isWithinCheckInTime
                    ? (language === 'en' ? 'Please wait for the check-in time window (9:00 AM - 11:00 AM).' : 'कृपया चेक-इन समय विंडो (सुबह 9:00 बजे - 11:00 बजे) का इंतजार करें।')
                    : (language === 'en' ? 'Please allow location access and verify you are in your assigned ward.' : 'कृपया लोकेशन एक्सेस की अनुमति दें और सत्यापित करें कि आप अपने निर्दिष्ट वार्ड में हैं।')}
                </p>
                <button
                  onClick={handleCheckIn}
                  disabled={!locationVerified || isCheckingIn || !currentLocation || !isWithinCheckInTime}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    locationVerified && !isCheckingIn && currentLocation && isWithinCheckInTime
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCheckingIn ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      {language === 'en' ? 'Checking In...' : 'चेक इन हो रहा है...'}
                    </>
                  ) : (
                    <>
                      <MapPin size={20} />
                      {language === 'en' ? 'Check In Now' : 'चेक इन करें'}
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Leave Request */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{language === 'en' ? 'Request Leave' : 'छुट्टी का अनुरोध'}</h3>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{language === 'en' ? 'Leave Type' : 'छुट्टी का प्रकार'}</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>{language === 'en' ? 'Sick Leave' : 'बीमारी की छुट्टी'}</option>
                  <option>{language === 'en' ? 'Casual Leave' : 'आकस्मिक छुट्टी'}</option>
                  <option>{language === 'en' ? 'Emergency' : 'आपातकालीन'}</option>
                </select>
              </div>
              <button className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {language === 'en' ? 'Submit Request' : 'अनुरोध भेजें'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Attendance Calendar - Full Width Below Top Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              {language === 'en' 
                ? `Attendance Log - ${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                : `उपस्थिति लॉग - ${new Date(currentYear, currentMonth).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })}`}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                  const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                  setCurrentMonth(newMonth);
                  setCurrentYear(newYear);
                  fetchAttendance(newMonth, newYear);
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                  const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                  setCurrentMonth(newMonth);
                  setCurrentYear(newYear);
                  fetchAttendance(newMonth, newYear);
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                →
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> {language === 'en' ? 'Present' : 'उपस्थित'}</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> {language === 'en' ? 'Leave' : 'छुट्टी'}</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> {language === 'en' ? 'Absent' : 'अनुपस्थित'}</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
          ))}

          {/* Empty slots for days before start of month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 md:h-24"></div>
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date() && !isToday;
            const isWeekendDay = isWeekend(day);
            const status = attendanceStatus[day] || (isWeekendDay ? 'weekend' : (isPast ? 'absent' : 'none'));
            
            let bgClass = "bg-gray-50 dark:bg-gray-700/50";
            let textClass = "text-gray-400";

            if (status === 'present') {
              bgClass = "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
              textClass = "text-green-700 dark:text-green-400";
            } else if (status === 'leave') {
              bgClass = "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
              textClass = "text-yellow-700 dark:text-yellow-400";
            } else if (status === 'absent') {
              bgClass = "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
              textClass = "text-red-700 dark:text-red-400";
            } else if (isWeekendDay) {
              bgClass = "bg-gray-100 dark:bg-gray-700/50";
              textClass = "text-gray-400";
            }

            return (
              <div 
                key={day} 
                className={`h-10 md:h-24 border rounded-xl p-2 flex flex-col justify-between transition-all hover:shadow-md ${bgClass} ${isToday ? 'ring-2 ring-blue-500' : ''} ${status !== 'none' && status !== 'weekend' ? 'border' : 'border-transparent'}`}
              >
                <span className={`text-sm font-semibold ${textClass} ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {day}
                </span>
                {status !== 'none' && status !== 'weekend' && (
                  <div className="hidden md:block">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${textClass}`}>
                      {language === 'en' ? status : (status === 'present' ? 'उपस्थित' : status === 'leave' ? 'छुट्टी' : 'अनुपस्थित')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmitIssue = () => {
    
  }

  const IssuesSection = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-6 text-gray-800 dark:text-gray-100">{language === 'en' ? 'New Request' : 'नया अनुरोध'}</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'en' ? 'Subject' : 'विषय'}</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder={language === 'en' ? 'Brief summary of the issue' : 'समस्या का संक्षिप्त सारांश'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'en' ? 'Description' : 'विवरण'}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none" placeholder={language === 'en' ? 'Detailed description...' : 'विस्तृत विवरण...'}></textarea>
            </div>
            <button onClick={handleSubmitIssue} className="w-full cursor-pointer bg-[#6F42C1] hover:bg-[#5a32a3] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all">
              <Send size={18} />
              {language === 'en' ? 'Submit Report' : 'रिपोर्ट भेजें'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{language === 'en' ? 'Recent Reports' : 'हाल की रिपोर्टें'}</h3>

          {recentIssues.map((issue) => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    issue.status === 'Open' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                  {issue.status}
                </span>
                <span className="text-xs text-gray-400">{issue.date}</span>
              </div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1 line-clamp-1" title={issue.subject}>
                {issue.subject}
              </h4>
              <button className="text-xs text-indigo-600 hover:underline mt-2 font-medium">View Details</button>
            </div>
          ))}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3 text-blue-700 dark:text-blue-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs leading-relaxed">
              {language === 'en'
                ? 'Tickets are usually resolved within 48 hours. For urgent matters, contact HR directly.'
                : 'टिकट आमतौर पर 48 घंटों के भीतर हल किए जाते हैं। तत्काल मामलों के लिए, सीधे एचआर से संपर्क करें।'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceSection = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{language === 'en' ? 'My Performance' : 'मेरा प्रदर्शन'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-6">{language === 'en' ? 'Task Completion' : 'कार्य पूर्णता'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="tasks" fill="#6F42C1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-6">{language === 'en' ? 'Quality Score Trend' : 'गुणवत्ता स्कोर रुझान'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorQuality2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="quality" stroke="#ec4899" fillOpacity={1} fill="url(#colorQuality2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection />;
      case 'payroll': return <PayrollSection />;
      case 'attendance': return <AttendanceSection />;
      case 'issues': return <IssuesSection />;
      case 'performance': return <PerformanceSection />;
      default: return <OverviewSection />;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'अवलोकन', icon: LayoutDashboard },
    { id: 'payroll', label: language === 'en' ? 'My Payroll' : 'मेरा वेतन', icon: Banknote },
    { id: 'attendance', label: language === 'en' ? 'Attendance' : 'उपस्थिति', icon: MapPin },
    { id: 'performance', label: language === 'en' ? 'Performance' : 'प्रदर्शन', icon: BarChart3 },
    { id: 'issues', label: language === 'en' ? 'Issues' : 'समस्याएं', icon: AlertCircle },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      <Navbar onSidebarToggle={toggleSidebar} />

      <div className="flex-1 flex overflow-hidden relative">

        {/* Sidebar */}
        <aside className={`
                    absolute lg:static top-0 left-0 h-full
                    w-64 bg-[#1e1b4b] text-gray-300 transition-transform duration-300 z-40 shrink-0 overflow-hidden
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
          <div className="p-4 space-y-2 mt-4">
            <div className="mb-8 px-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{language === 'en' ? 'Main Menu' : 'मुख्य मेनू'}</p>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === item.id
                  ? 'bg-[#6F42C1] text-white shadow-lg shadow-purple-500/20'
                  : 'hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="absolute bottom-8 left-0 w-full px-4">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
              {language === 'en' ? 'Sign Out' : 'साइन आउट'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 w-full max-w-7xl mx-auto">
          <div className="mt-12 lg:mt-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboard;