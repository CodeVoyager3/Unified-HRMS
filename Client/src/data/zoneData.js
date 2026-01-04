// Mock data for 12 MCD Delhi zones
// Structure designed to be easily replaced with REST API data

export const zonePerformanceData = [
    {
        zone_id: "zone_1",
        zone_name: "City SP Zone",
        short_name: "City SP",
        zone_name_hi: "सिटी एसपी जोन",
        short_name_hi: "सिटी एसपी",
        performance_score: 82,
        complaints_resolved: 88,
        complaints_pending: 45,
        sanitation_score: 85,
        revenue_collected: 124.5,
        trend: "up",
        coordinates: [77.23, 28.64], // City SP (Shifted East)
        boundary: [[77.21, 28.62], [77.25, 28.62], [77.26, 28.66], [77.22, 28.67], [77.21, 28.62]]
    },
    {
        zone_id: "zone_2",
        zone_name: "Central Zone",
        short_name: "Central",
        zone_name_hi: "केंद्रीय जोन",
        short_name_hi: "केंद्रीय",
        performance_score: 76,
        complaints_resolved: 82,
        complaints_pending: 67,
        sanitation_score: 78,
        revenue_collected: 156.2,
        trend: "up",
        coordinates: [77.25, 28.55], // Central
        boundary: [[77.23, 28.53], [77.27, 28.53], [77.28, 28.57], [77.24, 28.58], [77.23, 28.53]]
    },
    {
        zone_id: "zone_3",
        zone_name: "South Zone",
        short_name: "South",
        zone_name_hi: "दक्षिण जोन",
        short_name_hi: "दक्षिण",
        performance_score: 91,
        complaints_resolved: 94,
        complaints_pending: 23,
        sanitation_score: 92,
        revenue_collected: 198.7,
        trend: "up",
        coordinates: [77.20, 28.53], // South
        boundary: [[77.18, 28.51], [77.22, 28.51], [77.23, 28.55], [77.19, 28.56], [77.18, 28.51]]
    },
    {
        zone_id: "zone_4",
        zone_name: "Shahdara North Zone",
        short_name: "Shahdara N",
        zone_name_hi: "शाहदरा उत्तर जोन",
        short_name_hi: "शाहदरा उ.",
        performance_score: 58,
        complaints_resolved: 65,
        complaints_pending: 134,
        sanitation_score: 62,
        revenue_collected: 89.3,
        trend: "down",
        coordinates: [77.29, 28.69], // Shahdara North
        boundary: [[77.27, 28.67], [77.31, 28.67], [77.32, 28.71], [77.28, 28.72], [77.27, 28.67]]
    },
    {
        zone_id: "zone_5",
        zone_name: "Shahdara South Zone",
        short_name: "Shahdara S",
        zone_name_hi: "शाहदरा दक्षिण जोन",
        short_name_hi: "शाहदरा द.",
        performance_score: 45,
        complaints_resolved: 52,
        complaints_pending: 189,
        sanitation_score: 48,
        revenue_collected: 67.8,
        trend: "down",
        coordinates: [77.30, 28.62], // Shahdara South
        boundary: [[77.28, 28.60], [77.32, 28.60], [77.33, 28.64], [77.29, 28.65], [77.28, 28.60]]
    },
    {
        zone_id: "zone_6",
        zone_name: "Karol Bagh Zone",
        short_name: "Karol Bagh",
        zone_name_hi: "करोल बाग जोन",
        short_name_hi: "करोल बाग",
        performance_score: 72,
        complaints_resolved: 78,
        complaints_pending: 89,
        sanitation_score: 75,
        revenue_collected: 143.6,
        trend: "stable",
        coordinates: [77.18, 28.65], // Karol Bagh (Shifted slightly West)
        boundary: [[77.16, 28.63], [77.20, 28.63], [77.21, 28.67], [77.17, 28.68], [77.16, 28.63]]
    },
    {
        zone_id: "zone_7",
        zone_name: "Rohini Zone",
        short_name: "Rohini",
        zone_name_hi: "रोहिणी जोन",
        short_name_hi: "रोहिणी",
        performance_score: 87,
        complaints_resolved: 91,
        complaints_pending: 34,
        sanitation_score: 89,
        revenue_collected: 167.4,
        trend: "up",
        coordinates: [77.12, 28.71], // Rohini
        boundary: [[77.10, 28.69], [77.14, 28.69], [77.15, 28.73], [77.11, 28.74], [77.10, 28.69]]
    },
    {
        zone_id: "zone_8",
        zone_name: "Narela Zone",
        short_name: "Narela",
        zone_name_hi: "नरेला जोन",
        short_name_hi: "नरेला",
        performance_score: 42,
        complaints_resolved: 48,
        complaints_pending: 212,
        sanitation_score: 45,
        revenue_collected: 54.2,
        trend: "down",
        coordinates: [77.09, 28.84], // Narela
        boundary: [[77.07, 28.82], [77.11, 28.82], [77.12, 28.86], [77.08, 28.87], [77.07, 28.82]]
    },
    {
        zone_id: "zone_9",
        zone_name: "Civil Lines Zone",
        short_name: "Civil Lines",
        zone_name_hi: "सिविल लाइन्स जोन",
        short_name_hi: "सिविल लाइन्स",
        performance_score: 79,
        complaints_resolved: 84,
        complaints_pending: 56,
        sanitation_score: 81,
        revenue_collected: 112.8,
        trend: "up",
        coordinates: [77.22, 28.70], // Civil Lines (Shifted North)
        boundary: [[77.20, 28.68], [77.24, 28.68], [77.25, 28.72], [77.21, 28.73], [77.20, 28.68]]
    },
    {
        zone_id: "zone_10",
        zone_name: "Najafgarh Zone",
        short_name: "Najafgarh",
        zone_name_hi: "नजफगढ़ जोन",
        short_name_hi: "नजफगढ़",
        performance_score: 51,
        complaints_resolved: 58,
        complaints_pending: 167,
        sanitation_score: 54,
        revenue_collected: 78.9,
        trend: "stable",
        coordinates: [76.98, 28.61], // Najafgarh
        boundary: [[76.96, 28.59], [77.00, 28.59], [77.01, 28.63], [76.97, 28.64], [76.96, 28.59]]
    },
    {
        zone_id: "zone_11",
        zone_name: "West Zone",
        short_name: "West",
        zone_name_hi: "पश्चिम जोन",
        short_name_hi: "पश्चिम",
        performance_score: 68,
        complaints_resolved: 74,
        complaints_pending: 98,
        sanitation_score: 71,
        revenue_collected: 134.5,
        trend: "up",
        coordinates: [77.12, 28.64], // West Zone
        boundary: [[77.10, 28.62], [77.14, 28.62], [77.15, 28.66], [77.11, 28.67], [77.10, 28.62]]
    },
    {
        zone_id: "zone_12",
        zone_name: "Keshavpuram Zone",
        short_name: "Keshavpuram",
        zone_name_hi: "केशवपुरम जोन",
        short_name_hi: "केशवपुरम",
        performance_score: 63,
        complaints_resolved: 69,
        complaints_pending: 112,
        sanitation_score: 66,
        revenue_collected: 98.6,
        trend: "stable",
        coordinates: [77.15, 28.69], // Keshavpuram (Shifted West/North)
        boundary: [[77.13, 28.67], [77.17, 28.67], [77.18, 28.71], [77.14, 28.72], [77.13, 28.67]]
    }
];

// Helper function to get zone color based on performance score
export const getZoneColor = (score) => {
    if (score >= 75) return '#10b981'; // Green - Excellent
    if (score >= 50) return '#f59e0b'; // Yellow - Average
    return '#dc2626'; // Dark Red - Needs Attention
};

// Helper function to get zone by ID
export const getZoneById = (zoneId) => {
    return zonePerformanceData.find(zone => zone.zone_id === zoneId);
};

// Helper function to get trend icon
export const getTrendDisplay = (trend) => {
    switch (trend) {
        case 'up': return { icon: '↑', color: '#22c55e', label: 'Improving' };
        case 'down': return { icon: '↓', color: '#ef4444', label: 'Declining' };
        default: return { icon: '→', color: '#6b7280', label: 'Stable' };
    }
};
