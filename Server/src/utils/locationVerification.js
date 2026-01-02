const Ward = require('../models/Ward');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Get approximate center coordinates for a ward in Delhi
 * This is a simplified mapping - in production, you'd use actual ward boundary data
 * @param {number} wardNumber - Ward number
 * @param {string} zone - Zone name
 * @returns {Object} {latitude, longitude}
 */
function getWardCoordinates(wardNumber, zone) {
    // Verified Ward Coordinates (add more as needed)
    const WARD_COORDINATES = {
        '215': { latitude: 28.669435, longitude: 77.287206 }, // Shahdara, Bholanath Nagar
        // Add other wards here manually...
    };

    // Check if we have verified coordinates for this ward
    const wardKey = String(wardNumber);
    if (WARD_COORDINATES[wardKey]) {
        return WARD_COORDINATES[wardKey];
    }

    // Fallback: Delhi center coordinates (approximate)
    const delhiCenter = { latitude: 28.6139, longitude: 77.2090 };

    // Simplified ward mapping - each ward is offset slightly (for demo only)
    // In production, use actual ward boundary data from GIS or database
    const wardOffset = wardNumber * 0.01; // Small offset per ward

    return {
        latitude: delhiCenter.latitude + (wardOffset % 0.5),
        longitude: delhiCenter.longitude + (wardOffset % 0.5)
    };
}

/**
 * Verify if employee's current location is within their assigned ward
 * @param {number} currentLat - Current latitude
 * @param {number} currentLon - Current longitude
 * @param {number} assignedWard - Assigned ward number
 * @param {string} assignedZone - Assigned zone name
 * @param {number} allowedRadius - Allowed radius in meters (default: 1000m = 1km)
 * @returns {Object} {isValid: boolean, distance: number, message: string}
 */
async function verifyLocationInWard(currentLat, currentLon, assignedWard, assignedZone, allowedRadius = 1000) {
    if (!assignedWard) {
        return {
            isValid: false,
            distance: null,
            message: 'Employee has no assigned ward'
        };
    }

    let targetLat, targetLon;

    try {
        // Try to find exact ward coordinates from DB
        const wardDoc = await Ward.findOne({ wardNumber: String(assignedWard) });

        if (wardDoc) {
            targetLat = wardDoc.latitude;
            targetLon = wardDoc.longitude;
        } else {
            // Fallback to approximate logic
            const wardCoords = getWardCoordinates(assignedWard, assignedZone);
            targetLat = wardCoords.latitude;
            targetLon = wardCoords.longitude;
        }

        const distance = calculateDistance(
            currentLat,
            currentLon,
            targetLat,
            targetLon
        );

        const isValid = distance <= allowedRadius;

        return {
            isValid,
            distance: Math.round(distance),
            message: isValid
                ? `Location verified. You are ${Math.round(distance)}m from your assigned ward.`
                : `Location not verified. You are ${Math.round(distance)}m away from your assigned ward (allowed: ${allowedRadius}m).`,
            wardCoordinates: { latitude: targetLat, longitude: targetLon }
        };
    } catch (error) {
        console.error('Error in verifyLocationInWard:', error);
        return {
            isValid: false,
            distance: null,
            message: 'Error verifying location: ' + error.message
        };
    }
}

module.exports = {
    calculateDistance,
    getWardCoordinates,
    verifyLocationInWard
};


