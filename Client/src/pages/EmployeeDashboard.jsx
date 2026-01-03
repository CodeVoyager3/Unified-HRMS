import React, { useEffect, useState } from 'react';
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
  AlertTriangle,
  Loader,
  Download,
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Line, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmployeeDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Attendance state moved to top to prevent ReferenceError
  const [employeeId, setEmployeeId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [distanceFromWard, setDistanceFromWard] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isWithinCheckInTime, setIsWithinCheckInTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Placeholder Data
  // Payroll Data State
  const [payrollData, setPayrollData] = useState([]);
  const [salaryStructure, setSalaryStructure] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      if (!employeeId) {
        console.log("fetchStructure: No employeeId");
        return;
      }
      try {
        console.log("Fetching salary structure for:", employeeId);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/payroll/structure/${employeeId}`);
        const data = await response.json();
        console.log("Salary structure data:", data);
        if (data.success) {
          setSalaryStructure(data.structure);
        } else {
          console.error("Failed to fetch structure:", data.message);
        }
      } catch (error) {
        console.error("Error fetching salary structure:", error);
      }
    };
    fetchStructure();
  }, [employeeId]);


  useEffect(() => {
    const fetchPayroll = async () => {
      if (!employeeId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/payroll/employee/${employeeId}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.payrolls)) {
          // Map backend data to frontend structure
          const formattedData = data.payrolls.map(item => ({
            month: item.month, // "October 2026"
            amount: item.netAmount,
            status: item.status,
            ...item
          }));
          setPayrollData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
      }
    };
    fetchPayroll();
  }, [employeeId]);


  // Performance/Attendance Analytics State
  const [performanceData, setPerformanceData] = useState([
    { name: language === 'en' ? 'Week 1' : 'सप्ताह 1', tasks: 0, quality: 0 },
    { name: language === 'en' ? 'Week 2' : 'सप्ताह 2', tasks: 0, quality: 0 },
    { name: language === 'en' ? 'Week 3' : 'सप्ताह 3', tasks: 0, quality: 0 },
    { name: language === 'en' ? 'Week 4' : 'सप्ताह 4', tasks: 0, quality: 0 },
  ]);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);

  // Fetch attendance analytics for performance chart
  const fetchAttendanceAnalytics = async () => {
    if (!employeeId) return;

    setIsLoadingPerformance(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/attendance/analytics/${employeeId}?weeks=4`
      );
      const data = await response.json();
      if (data.success && data.analytics) {
        // Transform analytics data for chart
        const chartData = data.analytics.map((week, index) => ({
          name: language === 'en' ? `Week ${week.weekNumber} ` : `सप्ताह ${week.weekNumber} `,
          tasks: week.tasksCompleted,
          quality: week.quality || week.attendancePercentage
        }));
        setPerformanceData(chartData);
      }
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
    } finally {
      setIsLoadingPerformance(false);
    }
  };

  const [attendancePerformance, setAttendancePerformance] = useState('0%');

  const fetchAttendancePerformance = async () => {
    try {
      const storedData = localStorage.getItem('verifiedUser');
      if (!storedData) return;

      const userData = JSON.parse(storedData);
      const employeeId = userData.employeeId;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/employee/${employeeId}`);
      const data = await response.json();
      if (data.success) {
        setAttendancePerformance(data.attendancePercentage + '%');
      }
    } catch (error) {
      console.error('Error fetching attendance performance:', error);
    }
  };

  useEffect(() => {
    fetchAttendancePerformance();
  }, [setActiveTab]);

  const [issueCount, setIssueCount] = useState(0);

  const fetchIssueCount = async () => {
    try {
      const storedData = localStorage.getItem('verifiedUser');
      if (!storedData) return;

      const userData = JSON.parse(storedData);
      const employeeId = userData.employeeId;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue/count/${employeeId}`);
      const data = await response.json();
      if (data.success) {
        setIssueCount(data.issueCount);
      }
    } catch (error) {
      console.error('Error fetching issue count:', error);
    }
  };

  useEffect(() => {
    fetchIssueCount();
    fetchPerformanceAnalytics();
  }, [setActiveTab]);



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
              <h3 className="text-3xl font-bold">{attendancePerformance}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CalendarCheck size={24} />
            </div>
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
            {language === 'en'
              ? `Estimated: ₹${salaryStructure ? salaryStructure.projectedNet.toLocaleString() : '...'} `
              : `अनुमानित: ₹${salaryStructure ? salaryStructure.projectedNet.toLocaleString() : '...'} `}
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 mb-1">{language === 'en' ? 'Open Issues' : 'खुली समस्याएं'}</p>
              <h3 className="text-3xl font-bold">{issueCount}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-100">
            {issueCount === 0 ? (language === 'en' ? 'All clear!' : 'सब ठीक है!') : (language === 'en' ? 'There are open issues' : 'खुली समस्याएं हैं')}
          </div>
        </div>
      </div>

      {/* Recent Activity / Chart Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">{language === 'en' ? 'Performance Overview' : 'प्रदर्शन अवलोकन'}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" orientation="left" stroke="#6F42C1" domain={[0, 7]} allowDecimals={false} hide />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" domain={[0, 10]} hide />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [value, name]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="tasks"
                name={language === 'en' ? 'Attendance (Days)' : 'उपस्थिति (दिन)'}
                fill="#6F42C1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quality"
                name={language === 'en' ? 'Credit Score' : 'क्रेडिट स्कोर'}
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Helper to sum values if object
  const calculateTotal = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).reduce((sum, v) => sum + (Number(v) || 0), 0);
    }
    return 0;
  };

  const downloadSalarySlip = () => {
    console.log("Attempting to download slip...");
    if (!salaryStructure) {
      console.error("No salary structure available.");
      alert("Salary data not available yet.");
      return;
    }
    if (!user) {
      console.error("No user data available.");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Header
      doc.setFillColor(111, 66, 193); // Purple
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('Salary Slip', 20, 20);
      doc.setFontSize(12);
      doc.text('Unified HRMS', 20, 30);

      // Employee Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Employee Name: ${user.fullName || user.firstName}`, 20, 55);
      doc.text(`Employee ID: ${employeeId || 'N/A'}`, 20, 65);
      doc.text(`Month: ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} (Projected)`, 20, 75);

      // Prepare Table Data
      const baseSalary = salaryStructure.baseSalary || 0;
      const totalAllowances = calculateTotal(salaryStructure.allowances);
      const totalDeductions = calculateTotal(salaryStructure.deductions);
      const netSalary = salaryStructure.projectedNet || 0;

      const allowancesBreakdown = typeof salaryStructure.allowances === 'object'
        ? Object.entries(salaryStructure.allowances).map(([k, v]) => [`${k.toUpperCase()}`, `₹${v.toLocaleString()}`, '', ''])
        : [];

      const deductionsBreakdown = typeof salaryStructure.deductions === 'object'
        ? Object.entries(salaryStructure.deductions).map(([k, v]) => ['', '', `${k.toUpperCase()}`, `₹${v.toLocaleString()}`])
        : [];

      autoTable(doc, {
        startY: 90,
        head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
        body: [
          ['Base Salary', `₹${baseSalary.toLocaleString()}`, 'Total Deductions', `₹${totalDeductions.toLocaleString()}`],
          ['Allowances', `₹${totalAllowances.toLocaleString()}`, '', ''],
          ...allowancesBreakdown,
          ...deductionsBreakdown,
          ['', '', '', ''],
          ['Gross Earnings', `₹${(baseSalary + totalAllowances).toLocaleString()}`, 'Net Payable', `₹${netSalary.toLocaleString()}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [111, 66, 193] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('* This is a computer-generated slip based on projected attendance availability.', 20, finalY);

      const fileName = `Salary_Slip_${employeeId}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
      console.log("PDF saved as:", fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  const PayrollSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{language === 'en' ? 'My Payroll' : 'मेरा वेतन'}</h2>
        <button
          onClick={downloadSalarySlip}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Download size={16} />
          {language === 'en' ? 'Download Slip' : 'पर्ची डाउनलोड करें'}
        </button>
      </div>

      {/* Expected Payroll Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 mb-1 font-medium">{language === 'en' ? 'Expected Salary (Current Month)' : 'अपेक्षित वेतन (वर्तमान माह)'}</p>
              <h3 className="text-3xl font-bold mt-2">
                ₹{salaryStructure ? salaryStructure.projectedNet?.toLocaleString() : '...'}
              </h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Banknote size={24} />
            </div>
          </div>
          <p className="text-xs text-indigo-100 mt-4 opacity-90">
            {language === 'en'
              ? 'Calculated based on your attendance and base salary.'
              : 'आपकी उपस्थिति और मूल वेतन के आधार पर गणना की गई।'}
          </p>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 col-span-1 md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{language === 'en' ? 'Salary Breakdown' : 'वेतन विवरण'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{language === 'en' ? 'Base Salary' : 'मूल वेतन'}</p>
              <p className="font-semibold text-gray-900 dark:text-white">₹{salaryStructure ? salaryStructure.baseSalary?.toLocaleString() : '...'}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">{language === 'en' ? 'Allowances' : 'भत्ते'}</p>
              <p className="font-semibold text-green-700 dark:text-green-300">
                + ₹{salaryStructure ? calculateTotal(salaryStructure.allowances).toLocaleString() : '0'}
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">{language === 'en' ? 'Deductions (Est.)' : 'कटौती (अनुमानित)'}</p>
              <p className="font-semibold text-red-700 dark:text-red-300">
                - ₹{salaryStructure ? calculateTotal(salaryStructure.deductions).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8">{language === 'en' ? 'Payment History' : 'भुगतान इतिहास'}</h3>
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
            // Get Ward/Zone from localStorage
            const storedData = localStorage.getItem('verifiedUser');
            let ward = null;
            let zone = null;
            if (storedData) {
              const userData = JSON.parse(storedData);
              ward = userData.Ward;
              zone = userData.Zone;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/verify-location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeId, latitude, longitude, ward, zone })
            });
            const data = await response.json();
            setLocationVerified(data.isLocationVerified);
            if (data.distance !== undefined) setDistanceFromWard(data.distance);
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
      },
      { enableHighAccuracy: true }
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

    // Load local user data for display
    const storedData = localStorage.getItem('verifiedUser');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }

    if (employeeId) {
      fetchAttendance();
      fetchTodayAttendance();
      fetchAttendanceAnalytics();
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
      // Get Ward/Zone from localStorage
      const storedData = localStorage.getItem('verifiedUser');
      let ward = null;
      let zone = null;
      if (storedData) {
        const userData = JSON.parse(storedData);
        ward = userData.Ward;
        zone = userData.Zone;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/attendance/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          ward,
          zone
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
  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Mock Attendance Status: 1-10 Present, 11 Leave, 12 Absent, 13-today Mixed


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
                src={`https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe >
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
          </div >
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{locationError}</p>
            </div>
          )}

          {
            currentLocation && !locationVerified && (
              <div className="mb-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>
                  {language === 'en'
                    ? 'Tip: Desktop location is often inaccurate. Please use a mobile phone for precise GPS location.'
                    : 'सुझाव: डेस्कटॉप लोकेशन अक्सर गलत होती है। सटीक जीपीएस लोकेशन के लिए कृपया मोबाइल फोन का उपयोग करें।'}
                </span>
              </div>
            )
          }

          {
            currentLocation && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {language === 'en' ? 'Coordinates: ' : 'निर्देशांक: '}
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </div>
            )
          }

          {
            userData && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="font-semibold">{language === 'en' ? 'Assigned Location: ' : 'निर्दिष्ट स्थान: '}</span>
                {language === 'en' ? 'Zone' : 'जोन'} {userData.Zone || 'N/A'}, {language === 'en' ? 'Ward' : 'वार्ड'} {userData.Ward || 'N/A'}
              </div>
            )
          }
          {
            distanceFromWard !== null && (
              <div className={`text-xs ${distanceFromWard > 25000 ? 'text-red-600 font-bold' : 'text-gray-500 dark:text-gray-400'} mb-4`}>
                <span className="font-semibold">{language === 'en' ? 'Distance: ' : 'दूरी: '}</span>
                {distanceFromWard >= 1000 ? `${(distanceFromWard / 1000).toFixed(2)} km` : `${Math.round(distanceFromWard)} m`}
              </div>
            )
          }
          <button
            onClick={getCurrentLocation}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            {language === 'en' ? 'Refresh Location' : 'लोकेशन रीफ्रेश करें'}
          </button>
        </div >

        {/* Actions Section */}
        < div className="space-y-6" >
          {/* Mark Attendance */}
          < div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700" >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">{language === 'en' ? 'Mark Attendance' : 'उपस्थिति दर्ज करें'}</h3>
              <Clock className="text-blue-500" size={20} />
            </div>
            {
              todayAttendance?.checkInTime ? (
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
                  <div className={`mb-4 p-3 rounded-lg border ${isWithinCheckInTime
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={isWithinCheckInTime ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} size={16} />
                      <span className={`text-sm font-semibold ${isWithinCheckInTime
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-yellow-700 dark:text-yellow-400'
                        }`}>
                        {language === 'en' ? 'Check-in Time Window' : 'चेक-इन समय विंडो'}
                      </span>
                    </div>
                    <p className={`text-xs ${isWithinCheckInTime
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
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 ${locationVerified && !isCheckingIn && currentLocation && isWithinCheckInTime
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
              )
            }
          </div >

          {/* Leave Request */}
          < div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700" >
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
          </div >
        </div >
      </div >

      {/* Attendance Calendar - Full Width Below Top Section */}
      < div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700" >
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
      </div >
    </div >
  );

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [recentIssues, setRecentIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const storedData = localStorage.getItem('verifiedUser');
        if (!storedData) return;

        const localUser = JSON.parse(storedData);
        if (!localUser || !localUser.employeeId) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue/employee/${localUser.employeeId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedIssues = data.map(issue => ({
            id: issue._id,
            subject: issue.Title,
            date: new Date(issue.Date).toLocaleDateString(),
            status: issue.Status,
            description: issue.Description // Added description for modal
          }));
          setRecentIssues(formattedIssues);
        } else {
          setRecentIssues([]);
        }
      } catch (error) {
        setRecentIssues([]);
      }
    };
    fetchIssues();
  }, [user, subject, description]);



  const handleSubmitIssue = async (e) => {
    e.preventDefault();

    // 1. Retrieve Data
    const storedData = localStorage.getItem('verifiedUser');
    if (!storedData) {
      alert(language === 'en' ? "User identification missing. Please verify identity again." : "उपयोगकर्ता पहचान गायब है। कृपया फिर से पहचान सत्यापित करें।");
      return;
    }

    const user = JSON.parse(storedData);
    if (!user.employeeId) {
      alert("Employee ID not found in stored data.");
      return;
    }

    // 2. Send Request
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/employee-issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          title: subject,
          description: description,
          category: category
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(language === 'en' ? "Issue reported successfully!" : "समस्या सफलतापूर्वक रिपोर्ट की गई!");
        setSubject('');
        setDescription('');
        setCategory('General');
      } else {
        alert(result.message || "Failed to report issue.");
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert("Server error. Please try again later.");
    }
  }

  const IssuesSection = () => {
    return (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'en' ? 'Category' : 'श्रेणी'}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer">
                  <option value="General">{language === 'en' ? 'General' : 'सामान्य'}</option>
                  <option value="Vector Control">{language === 'en' ? 'Vector Control (Mosquitoes/Pests)' : 'वेक्टर नियंत्रण (मच्छर/कीट)'}</option>
                  <option value="Drainage">{language === 'en' ? 'Drainage' : 'जल निकासी'}</option>
                  <option value="Garbage">{language === 'en' ? 'Garbage Collection' : 'कचरा संग्रहण'}</option>
                </select>
              </div>

              <button onClick={handleSubmitIssue} className="w-full cursor-pointer bg-[#6F42C1] hover:bg-[#5a32a3] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all">
                <Send size={18} />
                {language === 'en' ? 'Submit Report' : 'रिपोर्ट भेजें'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{language === 'en' ? 'Recent Reports' : 'हाल की रिपोर्टें'}</h3>

            <div className="max-h-96 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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
                  <button onClick={() => setSelectedIssue(issue)} className="text-xs text-indigo-600 hover:underline mt-2 font-medium cursor-pointer">
                    {language === 'en' ? 'View Details' : 'विवरण देखें'}
                  </button>
                </div>
              ))}
            </div>

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

        {/* Details Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'en' ? 'Issue Details' : 'समस्या विवरण'}</h3>
                <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Status' : 'स्थिति'}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedIssue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      selectedIssue.status === 'Open' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                      }`}>{selectedIssue.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Date' : 'दिनांक'}</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{selectedIssue.date}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">{language === 'en' ? 'Subject' : 'विषय'}</p>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">{selectedIssue.subject}</h4>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">{language === 'en' ? 'Description' : 'विवरण'}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedIssue.description || (language === 'en' ? 'No description provided.' : 'कोई विवरण नहीं दिया गया।')}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                <button onClick={() => setSelectedIssue(null)} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fetch attendance analytics for performance chart
  const fetchPerformanceAnalytics = async () => {
    if (!employeeId) return;

    setIsLoadingPerformance(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/attendance/analytics/${employeeId}?weeks=4`
      );
      const data = await response.json();
      if (data.success && data.analytics) {
        // Transform analytics data for chart
        const chartData = data.analytics.map((week, index) => ({
          name: language === 'en' ? `Week ${week.weekNumber}` : `सप्ताह ${week.weekNumber}`,
          tasks: week.presentDays, // Using presentDays for left graph
          quality: week.weekCredit || 0 // Using credit for right graph
        }));
        setPerformanceData(chartData);
      }
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
    } finally {
      setIsLoadingPerformance(false);
    }
  };

  const PerformanceSection = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{language === 'en' ? 'My Performance' : 'मेरा प्रदर्शन'}</h2>
        <button
          onClick={fetchPerformanceAnalytics}
          disabled={isLoadingPerformance}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          {isLoadingPerformance ? (
            <>
              <Loader className="animate-spin" size={16} />
              {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
            </>
          ) : (
            <>
              <BarChart3 size={16} />
              {language === 'en' ? 'Refresh' : 'रीफ्रेश करें'}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Graph: Attendance (Days Present) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-2">{language === 'en' ? 'Attendance (Days Present)' : 'उपस्थिति (दिन उपस्थित)'}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {language === 'en'
              ? 'Number of days present per week'
              : 'प्रति सप्ताह उपस्थित दिनों की संख्या'}
          </p>
          <div className="h-64">
            {isLoadingPerformance ? (
              <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-gray-400" size={32} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 7]}
                    ticks={[0, 1, 3, 5, 7]}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value) => [value, language === 'en' ? 'Days' : 'दिन']}
                  />
                  <Bar dataKey="tasks" fill="#6F42C1" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Graph: Credit Score */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-2">{language === 'en' ? 'Credit Score' : 'क्रेडिट स्कोर'}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {language === 'en'
              ? 'Weekly performance credit score'
              : 'साप्ताहिक प्रदर्शन क्रेडिट स्कोर'}
          </p>
          <div className="h-64">
            {isLoadingPerformance ? (
              <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-gray-400" size={32} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value) => [value, language === 'en' ? 'Credits' : 'क्रेडिट']}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="quality" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {performanceData.some(d => d.tasks > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">{language === 'en' ? 'Total Tasks (Last 4 Weeks)' : 'कुल कार्य (अंतिम 4 सप्ताह)'}</p>
            <p className="text-2xl font-bold">
              {performanceData.reduce((sum, week) => sum + week.tasks, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">{language === 'en' ? 'Average Attendance' : 'औसत उपस्थिति'}</p>
            <p className="text-2xl font-bold">
              {performanceData.length > 0
                ? Math.round(performanceData.reduce((sum, week) => sum + week.quality, 0) / performanceData.length)
                : 0}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">{language === 'en' ? 'Best Week' : 'सर्वश्रेष्ठ सप्ताह'}</p>
            <p className="text-2xl font-bold">
              {performanceData.length > 0
                ? language === 'en'
                  ? `Week ${performanceData.reduce((max, week, idx) => week.quality > performanceData[max].quality ? idx : max, 0) + 1}`
                  : `सप्ताह ${performanceData.reduce((max, week, idx) => week.quality > performanceData[max].quality ? idx : max, 0) + 1}`
                : '-'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return OverviewSection();
      case 'payroll': return PayrollSection();
      case 'attendance': return AttendanceSection();
      case 'issues': return IssuesSection();
      case 'performance': return PerformanceSection();
      default: return OverviewSection();
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