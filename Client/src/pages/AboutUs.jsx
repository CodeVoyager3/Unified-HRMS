import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
import {
  Building2, Users, Target, Award, History, MapPin, Phone, Mail,
  Globe, Calendar, Shield, Briefcase, Heart, BookOpen, Scale,
  Landmark, FileText, TrendingUp, CheckCircle2, ArrowRight
} from 'lucide-react'

const AboutUs = () => {
  const { language } = useLanguage();

  // Leadership data
  const leadership = [
    {
      name: language === 'en' ? "Sh. Ashwani Kumar" : "श्री अश्वनी कुमार",
      designation: language === 'en' ? "Commissioner, MCD" : "आयुक्त, एमसीडी",
      image: "/embelem.png"
    },
    {
      name: language === 'en' ? "Smt. Priya Sharma" : "श्रीमती प्रिया शर्मा",
      designation: language === 'en' ? "Additional Commissioner (HR)" : "अतिरिक्त आयुक्त (मानव संसाधन)",
      image: "/embelem.png"
    },
    {
      name: language === 'en' ? "Sh. Rajesh Verma" : "श्री राजेश वर्मा",
      designation: language === 'en' ? "Director, IT Cell" : "निदेशक, आईटी सेल",
      image: "/embelem.png"
    }
  ];

  // Key statistics
  const statistics = [
    {
      value: "1,50,000+",
      label: language === 'en' ? "Total Workforce" : "कुल कार्यबल",
      icon: Users
    },
    {
      value: "12",
      label: language === 'en' ? "Zonal Offices" : "क्षेत्रीय कार्यालय",
      icon: Building2
    },
    {
      value: "272",
      label: language === 'en' ? "Wards Covered" : "वार्ड कवर किए गए",
      icon: MapPin
    },
    {
      value: "1958",
      label: language === 'en' ? "Established Since" : "स्थापना वर्ष",
      icon: Calendar
    }
  ];

  // Core values
  const coreValues = [
    {
      icon: Shield,
      title: language === 'en' ? "Transparency" : "पारदर्शिता",
      description: language === 'en'
        ? "We ensure complete transparency in all HR processes, from recruitment to retirement, through digital documentation and audit trails."
        : "हम भर्ती से लेकर सेवानिवृत्ति तक सभी मानव संसाधन प्रक्रियाओं में पूर्ण पारदर्शिता सुनिश्चित करते हैं।"
    },
    {
      icon: Scale,
      title: language === 'en' ? "Equity & Fairness" : "समानता और निष्पक्षता",
      description: language === 'en'
        ? "Equal opportunities for all employees regardless of background, with rule-based transfers and unbiased performance appraisals."
        : "सभी कर्मचारियों के लिए समान अवसर, नियम-आधारित स्थानांतरण और निष्पक्ष प्रदर्शन मूल्यांकन।"
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? "Efficiency" : "दक्षता",
      description: language === 'en'
        ? "Streamlined digital workflows that reduce processing time from weeks to hours, enhancing employee satisfaction and productivity."
        : "सुव्यवस्थित डिजिटल वर्कफ़्लो जो प्रसंस्करण समय को हफ्तों से घंटों तक कम कर देता है।"
    },
    {
      icon: Heart,
      title: language === 'en' ? "Employee Welfare" : "कर्मचारी कल्याण",
      description: language === 'en'
        ? "Comprehensive health schemes, timely salary disbursement, and grievance redressal mechanisms for our workforce's well-being."
        : "हमारे कार्यबल की भलाई के लिए व्यापक स्वास्थ्य योजनाएं और समय पर वेतन वितरण।"
    }
  ];

  // Milestones
  const milestones = [
    {
      year: "1958",
      title: language === 'en' ? "MCD Established" : "एमसीडी की स्थापना",
      description: language === 'en'
        ? "Municipal Corporation of Delhi was established under the Delhi Municipal Corporation Act, 1957."
        : "दिल्ली नगर निगम अधिनियम, 1957 के तहत दिल्ली नगर निगम की स्थापना।"
    },
    {
      year: "2012",
      title: language === 'en' ? "Trifurcation of MCD" : "एमसीडी का त्रिविभाजन",
      description: language === 'en'
        ? "MCD was split into three corporations: North, South, and East Delhi Municipal Corporations."
        : "एमसीडी को तीन निगमों में विभाजित किया गया: उत्तर, दक्षिण और पूर्वी दिल्ली।"
    },
    {
      year: "2022",
      title: language === 'en' ? "Reunification as MCD" : "एमसीडी के रूप में पुनर्एकीकरण",
      description: language === 'en'
        ? "The three municipal corporations were reunified into a single Municipal Corporation of Delhi."
        : "तीनों नगर निगमों को एकीकृत कर दिल्ली नगर निगम बना दिया गया।"
    },
    {
      year: "2024",
      title: language === 'en' ? "HRMS Launch" : "एचआरएमएस लॉन्च",
      description: language === 'en'
        ? "Launch of the Unified HRMS platform for digital transformation of HR processes across all departments."
        : "सभी विभागों में मानव संसाधन प्रक्रियाओं के डिजिटल परिवर्तन के लिए एकीकृत एचआरएमएस प्लेटफॉर्म का शुभारंभ।"
    }
  ];

  // Departments
  const departments = [
    { name: language === 'en' ? "Engineering Department" : "अभियांत्रिकी विभाग", employees: "35,000+" },
    { name: language === 'en' ? "Health Department" : "स्वास्थ्य विभाग", employees: "28,000+" },
    { name: language === 'en' ? "Education Department" : "शिक्षा विभाग", employees: "25,000+" },
    { name: language === 'en' ? "Sanitation Department" : "स्वच्छता विभाग", employees: "42,000+" },
    { name: language === 'en' ? "Revenue Department" : "राजस्व विभाग", employees: "8,000+" },
    { name: language === 'en' ? "Horticulture Department" : "बागवानी विभाग", employees: "6,000+" }
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section with Purple Gradient */}
      <section className="relative bg-gradient-to-br from-[#6F42C1] via-[#7c4dce] to-[#8b5cf6] dark:from-[#5a32a3] dark:via-[#6639b5] dark:to-[#7c4dce] text-white py-16 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6 opacity-80" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:underline">{language === 'en' ? 'Home' : 'होम'}</a></li>
              <li>/</li>
              <li className="font-medium">{language === 'en' ? 'About Us' : 'हमारे बारे में'}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {language === 'en' ? 'About MCD HRMS' : 'एमसीडी एचआरएमएस के बारे में'}
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-6">
                {language === 'en'
                  ? "The Unified Human Resource Management System (HRMS) is a flagship digital initiative by the Municipal Corporation of Delhi to modernize workforce management and ensure transparent, efficient, and employee-centric governance."
                  : "एकीकृत मानव संसाधन प्रबंधन प्रणाली (एचआरएमएस) दिल्ली नगर निगम की एक प्रमुख डिजिटल पहल है जो कार्यबल प्रबंधन को आधुनिक बनाने और पारदर्शी, कुशल शासन सुनिश्चित करने के लिए है।"}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#mission" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#6F42C1] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  {language === 'en' ? 'Our Mission' : 'हमारा मिशन'}
                  <ArrowRight size={18} />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/80 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {statistics.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20">
                    <Icon className="mx-auto mb-2 opacity-80" size={28} />
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/70 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

        {/* Mission & Vision Section */}
        <section id="mission" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#8b5cf6] flex items-center justify-center mb-6">
                  <Target className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'en' ? 'Our Mission' : 'हमारा मिशन'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {language === 'en'
                    ? "To digitally transform and unify all human resource management functions of the Municipal Corporation of Delhi, creating a seamless, transparent, and efficient ecosystem for over 1.5 lakh employees across all departments and zones."
                    : "दिल्ली नगर निगम के सभी मानव संसाधन प्रबंधन कार्यों को डिजिटल रूप से परिवर्तित और एकीकृत करना, सभी विभागों में 1.5 लाख से अधिक कर्मचारियों के लिए एक निर्बाध, पारदर्शी और कुशल पारिस्थितिकी तंत्र बनाना।"}
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? 'Paperless HR operations by 2026' : '2026 तक कागज़-रहित मानव संसाधन संचालन'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? '100% digital service books' : '100% डिजिटल सेवा पुस्तकें'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? 'Real-time grievance tracking' : 'वास्तविक समय में शिकायत ट्रैकिंग'}</span>
                  </li>
                </ul>
              </div>

              {/* Vision Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#8b5cf6] flex items-center justify-center mb-6">
                  <Award className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'en' ? 'Our Vision' : 'हमारी दृष्टि'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {language === 'en'
                    ? "To establish MCD as a model employer among urban local bodies in India by leveraging technology to empower employees, ensure timely service delivery, and foster a culture of accountability and excellence in public service."
                    : "भारत में शहरी स्थानीय निकायों में एमसीडी को एक आदर्श नियोक्ता के रूप में स्थापित करना, कर्मचारियों को सशक्त बनाने और सार्वजनिक सेवा में उत्कृष्टता की संस्कृति को बढ़ावा देने के लिए प्रौद्योगिकी का लाभ उठाना।"}
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? 'National e-Governance Award recognition' : 'राष्ट्रीय ई-गवर्नेंस पुरस्कार मान्यता'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? 'Employee satisfaction index above 85%' : 'कर्मचारी संतुष्टि सूचकांक 85% से ऊपर'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#6F42C1] dark:text-[#a074f0] flex-shrink-0 mt-0.5" size={18} />
                    <span>{language === 'en' ? 'Zero-pendency in HR requests' : 'मानव संसाधन अनुरोधों में शून्य-लंबितता'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 text-[#6F42C1] dark:text-[#a074f0] rounded-full text-sm font-semibold mb-4">
                {language === 'en' ? 'Our Foundation' : 'हमारी नींव'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Core Values' : 'मूल मूल्य'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {language === 'en'
                  ? "The guiding principles that drive every decision and process within the MCD HRMS ecosystem."
                  : "मार्गदर्शक सिद्धांत जो एमसीडी एचआरएमएस पारिस्थितिकी तंत्र के भीतर हर निर्णय और प्रक्रिया को संचालित करतेहैं।"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-[#6F42C1] dark:hover:border-[#a074f0] transition-all hover:shadow-lg">
                    <div className="w-12 h-12 rounded-lg bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 flex items-center justify-center mb-4 group-hover:bg-[#6F42C1] dark:group-hover:bg-[#a074f0] transition-colors">
                      <Icon className="text-[#6F42C1] dark:text-[#a074f0] group-hover:text-white transition-colors" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History Timeline Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 text-[#6F42C1] dark:text-[#a074f0] rounded-full text-sm font-semibold mb-4">
                {language === 'en' ? 'Our Journey' : 'हमारी यात्रा'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Key Milestones' : 'प्रमुख मील के पत्थर'}
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6F42C1] via-[#8b5cf6] to-[#a074f0]"></div>

              <div className="space-y-8 md:space-y-0">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative md:flex md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                        <span className="inline-block px-3 py-1 bg-[#6F42C1] dark:bg-[#a074f0] text-white text-sm font-bold rounded-full mb-3">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#6F42C1] dark:bg-[#a074f0] border-4 border-white dark:border-gray-950 shadow-lg"></div>

                    {/* Empty Space */}
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#6F42C1]/5 via-[#8b5cf6]/5 to-[#a074f0]/5 dark:from-[#6F42C1]/10 dark:via-[#8b5cf6]/10 dark:to-[#a074f0]/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 text-[#6F42C1] dark:text-[#a074f0] rounded-full text-sm font-semibold mb-4">
                {language === 'en' ? 'Our Departments' : 'हमारे विभाग'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Integrated Departments' : 'एकीकृत विभाग'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {language === 'en'
                  ? "The HRMS connects all major departments of MCD, ensuring unified workforce management across the organization."
                  : "एचआरएमएस एमसीडी के सभी प्रमुख विभागों को जोड़ता है, संगठन में एकीकृत कार्यबल प्रबंधन सुनिश्चित करता है।"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-[#6F42C1] dark:hover:border-[#a074f0] transition-all hover:shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="text-[#6F42C1] dark:text-[#a074f0]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{dept.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{dept.employees} {language === 'en' ? 'Employees' : 'कर्मचारी'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#6F42C1]/10 dark:bg-[#a074f0]/20 text-[#6F42C1] dark:text-[#a074f0] rounded-full text-sm font-semibold mb-4">
                {language === 'en' ? 'Leadership' : 'नेतृत्व'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Key Officials' : 'प्रमुख अधिकारी'}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <div key={index} className="text-center group">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6F42C1]/20 to-[#8b5cf6]/20 dark:from-[#6F42C1]/30 dark:to-[#8b5cf6]/30 flex items-center justify-center border-4 border-[#6F42C1]/30 dark:border-[#a074f0]/30 group-hover:border-[#6F42C1] dark:group-hover:border-[#a074f0] transition-colors">
                    <img src={leader.image} alt={leader.name} className="w-16 h-16 object-contain opacity-60" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{leader.name}</h3>
                  <p className="text-sm text-[#6F42C1] dark:text-[#a074f0] font-medium">{leader.designation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="bg-gradient-to-br from-[#6F42C1] via-[#7c4dce] to-[#8b5cf6] dark:from-[#5a32a3] dark:via-[#6639b5] dark:to-[#7c4dce] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>

              <div className="relative grid lg:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}
                  </h2>
                  <p className="text-white/80 mb-8">
                    {language === 'en'
                      ? "For any queries related to the HRMS portal or HR policies, please reach out to us through the following channels."
                      : "एचआरएमएस पोर्टल या मानव संसाधन नीतियों से संबंधित किसी भी प्रश्न के लिए, कृपया निम्नलिखित माध्यमों से हमसे संपर्क करें।"}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{language === 'en' ? 'Head Office' : 'मुख्य कार्यालय'}</h4>
                        <p className="text-white/70 text-sm">Civic Centre, Minto Road, New Delhi - 110002</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{language === 'en' ? 'Toll-Free Helpline' : 'टोल-फ्री हेल्पलाइन'}</h4>
                        <p className="text-white/70 text-sm">1800-11-0031 (24x7)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{language === 'en' ? 'Email Support' : 'ईमेल सहायता'}</h4>
                        <p className="text-white/70 text-sm">helpdesk-hrms@mcd.nic.in</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Globe size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{language === 'en' ? 'Official Website' : 'आधिकारिक वेबसाइट'}</h4>
                        <p className="text-white/70 text-sm">www.mcd.gov.in</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Office Hours' : 'कार्यालय समय'}</h3>
                  <div className="space-y-3 text-white/90">
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span>{language === 'en' ? 'Monday - Friday' : 'सोमवार - शुक्रवार'}</span>
                      <span className="font-medium">9:30 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span>{language === 'en' ? 'Saturday' : 'शनिवार'}</span>
                      <span className="font-medium">9:30 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>{language === 'en' ? 'Sunday' : 'रविवार'}</span>
                      <span className="font-medium text-white/60">{language === 'en' ? 'Closed' : 'बंद'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="font-semibold mb-2">{language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}</h4>
                    <div className="flex flex-wrap gap-2">
                      <a href="#" className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">RTI Portal</a>
                      <a href="#" className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Grievance</a>
                      <a href="#" className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors">Downloads</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default AboutUs