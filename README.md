# Unified HRMS: A Digital Ecosystem for the Municipal Corporation of Delhi

### Project Overview

**Unified HRMS (U-HRMS)** is a centralized, secure, and scalable Human Resource Management System specifically designed to modernize the fragmented HR operations of the **Municipal Corporation of Delhi (MCD)**. The platform integrates recruitment, attendance, payroll, performance monitoring, and grievance redressal into a single "Source of Truth," replacing manual paper-based workflows with automated, data-driven processes.

---

### 🚀 Key Features

* **Hierarchical Role-Based Dashboards**: Provides specialized interfaces for the Commissioner (HOD), Deputy Commissioner, Sanitary Inspector, and Employee, each with tailored tools for their specific administrative level.
* **Smart Geofenced Attendance**: Implements high-precision location verification using **Leaflet** and **MapLibre GL** to ensure field staff can only mark attendance within assigned municipal ward boundaries.
* **Automated Payroll Engine**: Seamlessly calculates monthly salaries and generates digital payslips using **jsPDF** based on verified attendance and performance data.
* **AI-Powered Bilingual Assistant**: Features an intelligent "UHRMS Bot" integrated with the **Groq SDK** to provide 24/7 HR guidance in both **English and Hindi**.
* **Transparent Recruitment Lifecycle**: Allows administrators to post locality-specific vacancies that automatically expire after a set deadline (e.g., 15 days) to ensure an active and updated career portal.
* **Digital Service Books (e-SB)**: Maintains an immutable digital career timeline for every municipal employee, eliminating the risk of data loss from physical files.
* **Centralized Grievance Redressal**: Empowers employees to file and track grievances regarding pay, leaves, or transfers in real-time for improved accountability.

---

### 🛠️ Tech Stack

#### **Frontend**

* **React 19 & Vite**: High-performance, modern framework for a responsive user experience.
* **Tailwind CSS v4**: Utility-first styling for a clean, accessible, and mobile-first UI.
* **Recharts**: Interactive data visualization for zonal performance and workforce analytics.
* **Framer Motion & GSAP**: Professional web animations for smooth transitions between HR modules.

#### **Backend**

* **Node.js & Express v5**: Scalable server-side architecture for handling massive municipal data loads.
* **MongoDB & Mongoose**: Flexible NoSQL database for managing hierarchical organizational structures.
* **Clerk Auth**: Robust industry-standard authentication and Role-Based Access Control (RBAC).
* **Tesseract.js & PDF-Parse**: Automated OCR for verifying uploaded employee documentation.

---

### 📂 Project Structure

```text
unified-hrms/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Modules (Navbar, Footer, Dashboards)
│   │   ├── context/        # Global State (Theme, Language, Font Size)
│   │   ├── data/           # Static GeoData (Wards, Zones)
│   │   └── pages/          # Application Views (Commissioner, Employee, etc.)
│   └── public/             # Static Assets (Logos, Icons)
└── Server/                 # Node.js Backend
    ├── src/
    │   ├── controllers/    # Business Logic (Payroll, Recruitment, etc.)
    │   ├── models/         # MongoDB Schemas (Attendance, User, etc.)
    │   ├── routes/         # API Endpoints (Attendance, Commissioner, etc.)
    │   ├── services/       # Core Engines (AI, Geofencing, Payroll)
    │   └── utils/          # DB Connection & Verification Utilities
    └── server.js           # Main Entry Point

```

---

### ⚙️ Installation & Setup

#### **Prerequisites**

* Node.js (v18+)
* MongoDB Instance
* Clerk and Groq API Keys

#### **Backend Configuration**

1. Navigate to the `Server` directory: `cd Server`.
2. Install dependencies: `npm install`.
3. Create a `.env` file and configure:
```env
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_key
GROQ_API_KEY=your_groq_key

```


4. Start the server: `npm start`.

#### **Frontend Configuration**

1. Navigate to the `Client` directory: `cd Client`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

---

### 🛡️ Administrative Architecture

The system employs a strict **Role-Based Access Control (RBAC)** to maintain data security:

* **Commissioner**: High-level city-wide analytics, vacancy management, and inter-zone transfer approvals.
* **Deputy Commissioner**: Zonal oversight, disciplinary action tracking, and local HR coordination.
* **Sanitary Inspector**: Direct monitoring of field staff attendance, inventory, and performance credits.
* **Employee**: Personal dashboard for payslip downloads, leave applications, and grievance tracking.

---

### 📄 Compliance & License

* **GIGW 3.0**: Built according to **Guidelines for Indian Government Websites** for full accessibility (High Contrast, Font Resizing, Bilingual Support).
* **License**: This project is licensed under the **ISC License**.
