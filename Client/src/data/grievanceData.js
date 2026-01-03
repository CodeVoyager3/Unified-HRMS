export const grievanceStats = {
    total_complaints: 1250,
    resolved_today: 45,
    pending_critical: 12,
    avg_resolution_time: "48 Hours",
    sentiment_score: 65, // 0-100 (0=Angry, 100=Happy)
    sentiment_trend: "up"
};

export const sentimentData = [
    { name: 'Satisfied', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 20, color: '#f59e0b' },
    { name: 'Dissatisfied', value: 15, color: '#ef4444' },
];

export const criticalComplaints = [
    {
        id: "GR-2024-001",
        issue: "Open Manhole near School",
        location: "Rohini Sector 18",
        zone: "Rohini",
        priority: "High",
        reported_time: "2 Hours ago",
        status: "Pending",
        description: "Dangerous open manhole posing risk to school children."
    },
    {
        id: "GR-2024-002",
        issue: "Garbage Dump Overflow",
        location: "Karol Bagh Market",
        zone: "Karol Bagh",
        priority: "Medium",
        reported_time: "5 Hours ago",
        status: "In Progress",
        description: "Sanitation staff not deployed for 2 days."
    },
    {
        id: "GR-2024-003",
        issue: "Street Light Failure",
        location: "Lajpat Nagar II",
        zone: "Central",
        priority: "Low",
        reported_time: "1 Day ago",
        status: "Pending",
        description: "Entire block in darkness."
    },
    {
        id: "GR-2024-004",
        issue: "Dengue Larvae Detection",
        location: "Vasant Kunj",
        zone: "South",
        priority: "Critical",
        reported_time: "30 Mins ago",
        status: "Escalated",
        description: "Multiple cases reported in block C."
    }
];

export const slaBreaches = [
    {
        id: "GR-OLD-889",
        issue: "Illegal Construction",
        zone: "Civil Lines",
        days_open: 15,
        responsible_officer: "Mrs. Anjali Gupta (JE)"
    },
    {
        id: "GR-OLD-912",
        issue: "Water Logging",
        zone: "Shahdara North",
        days_open: 5,
        responsible_officer: "Mr. R.K. Sharma (AE)"
    }
];

export const zoneComplaintDistribution = [
    { name: 'Rohini', complaints: 120 },
    { name: 'South', complaints: 98 },
    { name: 'Civil Lines', complaints: 86 },
    { name: 'Central', complaints: 75 },
    { name: 'Shahdara S', complaints: 65 },
    { name: 'West', complaints: 55 },
];
