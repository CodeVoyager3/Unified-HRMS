import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
    en: {
        // Navbar
        govtIndia: "Government of India",
        skipMain: "Skip to Main Content",
        accessibility: "Accessibility",
        aboutUs: "About Us",
        onlineServices: "Online Services",
        publicNotices: "Public Notices",
        employeeCorner: "Employee Corner",
        search: "Search services...",
        searchPlaceholder: "Search...",
        login: "Login",
        signup: "Sign Up",
        switchLang: "English", // Label to switch TO

        // Hero
        latestCirculars: "Latest Circulars & Notifications",
        heroTitlePrefix: "Empowering Delhi's ",
        heroTitleHighlight: "Municipal Workforce",
        heroTitleSuffix: "with Unified HRMS",
        heroSubtitle: "A single, secure platform for MCD employees to manage attendance, payroll, transfers, and grievances efficiently and transparently.",
        employeeLogin: "Employee Login",
        deptAdmin: "Department Admin",
        feedback: "Feedback",

        // Ticker
        latestNews: "Latest News",
        viewAll: "View All",
        // Mock updates (simplified for translation)
        updates: [
            "Portal Update: New transfer policy circular issued by Commissioner (MCD).",
            "Attention: Mandatory biometric verification for field staff starts from Jan 1st.",
            "Payroll Alert: December salary slips are now available for download.",
            "New Feature: Employees can now track grievance status in real-time.",
            "Notification: Annual Performance Appraisal (APAR) window is now open for Grade A & B officers.",
            "Health Scheme: Updated list of empanelled hospitals for MCD employees released."
        ],

        // Stats
        systemImpact: "System Impact at a Glance",
        impactDesc: "Real-time monitoring of Delhi's municipal workforce through unified digital governance and transparent data tracking.",
        totalEmployees: "Total Employees",
        activeDepts: "Active Departments",
        grievanceRes: "Grievance Resolution",
        zonalOffices: "Zonal Offices",
        registeredStaff: "Registered municipal staff",
        integratedDir: "Integrated directorates",
        avgSuccess: "Average success rate",
        acrossDelhi: "Across Delhi regions",

        // Features
        coreFunc: "Core Functionality",
        modernizingOps: "Modernizing Municipal Operations",
        modernizingDesc: "The MCD HRMS integrates fragmented manual processes into a single, secure, and scalable digital platform designed for government needs.",
        learnMore: "Learn more",
        feat1Title: "Smart Geofenced Attendance",
        feat1Desc: "GPS-based marking ensures staff can only clock-in within designated municipal zones, eliminating proxy attendance for field workers.",
        feat2Title: "One-Click Automated Payroll",
        feat2Desc: "Seamlessly calculates salaries based on biometric data, leaves, and tax regimes, generating thousands of digital payslips instantly.",
        feat3Title: "Digital Service Books (e-SB)",
        feat3Desc: "A unified, immutable digital record of an employee's entire career history, replacing fragile physical files and reducing delays.",
        feat4Title: "Transparent Transfer Policy",
        feat4Desc: "Rule-based employee rotation and posting management that reduces manual intervention and ensures fair distribution of workforce.",
        feat5Title: "Grievance Redressal Portal",
        feat5Desc: "Empowers employees to file complaints regarding pay or leave online and track their resolution status in real-time.",
        feat6Title: "Workforce Analytics & Reports",
        feat6Desc: "Provides administration with dashboards on attendance trends, vacancy status, and budget utilization for data-driven planning.",


        // CTA
        mobileFirst: "Mobile First Governance",
        pocketTitle: "Attendance & Payroll in your pocket.",
        pocketDesc: "Download the official MCD HRMS mobile application to mark attendance via geofencing, view digital payslips, and apply for leaves on the go.",
        getPlayStore: "Get it on Play Store",
        iosComing: "iOS App coming soon",
        webPortal: "Web Portal Access",
        webDesc: "Access your unified dashboard via secure SSO login.",
        accessAadhaar: "Access with Aadhaar or Bio-ID",
        authOnly: "Authorized Personnel Only",
        protectedText: "Protected by 256-bit SSL Encryption. Managed by MCD IT Cell.",

        // Footer
        mcdHrms: "MCD HRMS",
        mcdDesc: "The Unified Human Resource Management System for the Municipal Corporation of Delhi. Streamlining governance through digital transparency and employee empowerment.",
        tollFree: "Toll Free: 1800-11-XXXX",
        hrServices: "HR Services",
        citizens: "Citizens",
        resources: "Resources",
        support: "Support",
        projectBy: "Project Initiative By",
        address: "Municipal Corporation of Delhi, Civic Centre, Minto Road, New Delhi - 110002",
        copyright: "© 2025 - Municipal Corporation of Delhi (MCD). All rights reserved.",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        hyperlink: "Hyperlinking Policy",
        copyrightPol: "Copyright Policy",

        // Footer Links
        hrLink1: "Attendance Portal",
        hrLink2: "Payroll & Slips",
        hrLink3: "Transfer Orders",
        hrLink4: "Performance Appraisal",
        hrLink5: "Grievance Filing",

        citLink1: "Public Notices",
        citLink2: "Tender Portal",
        citLink3: "Property Tax",
        citLink4: "Birth/Death Certs",
        citLink5: "Health Licenses",

        resLink1: "User Manuals",
        resLink2: "Office Orders",
        resLink3: "Policy Documents",
        resLink4: "Forms & Formats",
        resLink5: "Open Data",

        supLink1: "Technical FAQ",
        supLink2: "Nodal Officers",
        supLink3: "Contact Directory",
        supLink4: "Site Map",
        supLink5: "Accessibility Help"
    },
    hi: {
        // Navbar
        govtIndia: "भारत सरकार",
        skipMain: "मुख्य सामग्री पर जाएं",
        accessibility: "अभिगम्यता",
        aboutUs: "हमारे बारे में",
        onlineServices: "ऑनलाइन सेवाएं",
        publicNotices: "सार्वजनिक सूचनाएं",
        employeeCorner: "कर्मचारी कॉर्नर",
        search: "सेवाएं खोजें...",
        searchPlaceholder: "खोजें...",
        login: "लॉगिन",
        signup: "साइन अप",
        switchLang: "हिन्दी",

        // Hero
        latestCirculars: "नवीनतम परिपत्र और सूचनाएं",
        heroTitlePrefix: "एकीकृत एचआरएमएस के साथ ",
        heroTitleHighlight: "दिल्ली के निगम कर्मचारियों",
        heroTitleSuffix: " को सशक्त बनाना",
        heroSubtitle: "हाजिरी, वेतन, स्थानांतरण और शिकायतों को कुशलतापूर्वक और पारदर्शी रूप से प्रबंधित करने के लिए एमसीडी कर्मचारियों के लिए एक एकल, सुरक्षित मंच।",
        employeeLogin: "कर्मचारी लॉगिन",
        deptAdmin: "विभाग व्यवस्थापक",
        feedback: "सुझाव",

        // Ticker
        latestNews: "नवीनतम समाचार",
        viewAll: "सभी देखें",
        updates: [
            "पोर्टल अपडेट: आयुक्त (एमसीडी) द्वारा नई स्थानांतरण नीति पत्र जारी किया गया।",
            "ध्यान दें: फील्ड स्टाफ के लिए अनिवार्य बायोमेट्रिक सत्यापन 1 जनवरी से शुरू होगा।",
            "वेतन चेतावनी: दिसंबर वेतन पर्ची अब डाउनलोड के लिए उपलब्ध है।",
            "नई सुविधा: कर्मचारी अब वास्तविक समय में शिकायत की स्थिति को ट्रैक कर सकते हैं।",
            "अधिसूचना: वार्षिक प्रदर्शन मूल्यांकन (APAR) विंडो अब ग्रेड ए और बी अधिकारियों के लिए खुली है।",
            "स्वास्थ्य योजना: एमसीडी कर्मचारियों के लिए सूचीबद्ध अस्पतालों की अद्यतन सूची जारी की गई।"
        ],

        // Stats
        systemImpact: "सिस्टम प्रभाव एक नज़र में",
        impactDesc: "एकीकृत डिजिटल शासन और पारदर्शी डेटा ट्रैकिंग के माध्यम से दिल्ली के निगम कर्मचारियों की वास्तविक समय की निगरानी।",
        totalEmployees: "कुल कर्मचारी",
        activeDepts: "सक्रिय विभाग",
        grievanceRes: "शिकायत निवारण",
        zonalOffices: "क्षेत्रीय कार्यालय",
        registeredStaff: "पंजीकृत निगम कर्मचारी",
        integratedDir: "एकीकृत निदेशालय",
        avgSuccess: "औसत सफलता दर",
        acrossDelhi: "पूरे दिल्ली क्षेत्र में",

        // Features
        coreFunc: "मुख्य कार्यक्षमता",
        modernizingOps: "निगम कार्यों का आधुनिकीकरण",
        modernizingDesc: "एमसीडी एचआरएमएस खंडित मैनुअल प्रक्रियाओं को सरकारी जरूरतों के लिए डिज़ाइन किए गए एक एकल, सुरक्षित और स्केलेबल डिजिटल प्लेटफॉर्म में एकीकृत करता है।",
        learnMore: "और जानें",
        feat1Title: "स्मार्ट जियोफेंस उपस्थिति",
        feat1Desc: "जीपीएस-आधारित अंकन यह सुनिश्चित करता है कि कर्मचारी केवल निर्दिष्ट निगम क्षेत्रों के भीतर ही घड़ी-इन कर सकें, जिससे फील्ड वर्करों के लिए प्रॉक्सी उपस्थिति समाप्त हो सके।",
        feat2Title: "एक-क्लिक स्वचालित पेरोल",
        feat2Desc: "बायोमेट्रिक डेटा, पत्तियों और कर व्यवस्थाओं के आधार पर वेतन की गणना करता है, जिससे हजारों डिजिटल वेतन पर्चियां तुरंत उत्पन्न होती हैं।",
        feat3Title: "डिजिटल सेवा पुस्तकें (e-SB)",
        feat3Desc: "कर्मचारी के पूरे करियर इतिहास का एक एकीकृत, अपरिवर्तनीय डिजिटल रिकॉर्ड, नाजुक भौतिक फ़ाइलों को प्रतिस्थापित करता है और देरी को कम करता है।",
        feat4Title: "पारदर्शी स्थानांतरण नीति",
        feat4Desc: "नियम-आधारित कर्मचारी रोटेशन और पोस्टिंग प्रबंधन जो मैनुअल हस्तक्षेप को कम करता है और कर्मचारियों का निष्पक्ष वितरण सुनिश्चित करता है।",
        feat5Title: "शिकायत निवारण पोर्टल",
        feat5Desc: "कर्मचारियों को वेतन या छुट्टी के संबंध में ऑनलाइन शिकायत दर्ज करने और वास्तविक समय में उनके समाधान की स्थिति को ट्रैक करने का अधिकार देता है।",
        feat6Title: "कार्यबल विश्लेषण और रिपोर्ट",
        feat6Desc: "डेटा-संचालित योजना के लिए उपस्थिति रुझान, रिक्ति की स्थिति और बजट उपयोग पर डैशबोर्ड के साथ प्रशासन प्रदान करता है।",

        // CTA
        mobileFirst: "मोबाइल प्रथम शासन",
        pocketTitle: "उपस्थिति और पेरोल आपकी जेब में।",
        pocketDesc: "जियोफेंसिंग के माध्यम से उपस्थिति दर्ज करने, डिजिटल वेतन पर्चियां देखने और चलते-फिरते छुट्टियों के लिए आवेदन करने के लिए आधिकारिक एमसीडी एचआरएमएस मोबाइल एप्लिकेशन डाउनलोड करें।",
        getPlayStore: "प्ले स्टोर पर प्राप्त करें",
        iosComing: "आईओएस ऐप जल्द आ रहा है",
        webPortal: "वेब पोर्टल एक्सेस",
        webDesc: "सुरक्षित एसएसओ लॉगिन के माध्यम से अपने एकीकृत डैशबोर्ड तक पहुंचें।",
        accessAadhaar: "आधार या बायो-आईडी के साथ पहुंचें",
        authOnly: "केवल अधिकृत कार्मिक",
        protectedText: "256-बिट एसएसएल एन्क्रिप्शन द्वारा सुरक्षित। एमसीडी आईटी सेल द्वारा प्रबंधित।",

        // Footer
        mcdHrms: "एमसीडी एचआरएमएस",
        mcdDesc: "दिल्ली नगर निगम के लिए एकीकृत मानव संसाधन प्रबंधन प्रणाली। डिजिटल पारदर्शिता और कर्मचारी सशक्तिकरण के माध्यम से शासन को सुव्यवस्थित करना।",
        tollFree: "टोल फ्री: 1800-11-XXXX",
        hrServices: "एचआर सेवाएं",
        citizens: "नागरिक",
        resources: "संसाधन",
        support: "सहायता",
        projectBy: "परियोजना पहल",
        address: "दिल्ली नगर निगम, सिविक सेंटर, मिंटो रोड, नई दिल्ली - 110002",
        copyright: "© 2025 - दिल्ली नगर निगम (एमसीडी)। सर्वाधिकार सुरक्षित।",
        terms: "सेवा की शर्तें",
        privacy: "गोपनीयता नीति",
        hyperlink: "हाइपरलिंकिंग नीति",
        copyrightPol: "कॉपीराइट नीति",

        // Footer Links
        hrLink1: "उपस्थिति पोर्टल",
        hrLink2: "वेतन और पर्चियां",
        hrLink3: "स्थानांतरण आदेश",
        hrLink4: "प्रदर्शन मूल्यांकन",
        hrLink5: "शिकायत दर्ज करना",

        citLink1: "सार्वजनिक सूचनाएं",
        citLink2: "निविदा पोर्टल",
        citLink3: "संपत्ति कर",
        citLink4: "जन्म/मृत्यु प्रमाण पत्र",
        citLink5: "स्वास्थ्य लाइसेंस",

        resLink1: "उपयोगकर्ता नियमावली",
        resLink2: "कार्यालय आदेश",
        resLink3: "नीति दस्तावेज",
        resLink4: "प्रपत्र और प्रारूप",
        resLink5: "खुला डेटा",

        supLink1: "तकनीकी प्रश्नोत्तर",
        supLink2: "नोडल अधिकारी",
        supLink3: "संपर्क निर्देशिका",
        supLink4: "साइट मैप",
        supLink5: "अभिगम्यता सहायता"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
