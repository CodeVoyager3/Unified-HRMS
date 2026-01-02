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
    // Delhi center coordinates (approximate)
    const delhiCenter = { latitude: 28.6139, longitude: 77.2090 };
    
    // Simplified ward mapping - each ward is offset slightly
    // In production, use actual ward boundary data from GIS
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
function verifyLocationInWard(currentLat, currentLon, assignedWard, assignedZone, allowedRadius = 1000) {
    if (!assignedWard) {
        return {
            isValid: false,
            distance: null,
            message: 'Employee has no assigned ward'
        };
    }

    const wardCoords = getWardCoordinates(assignedWard, assignedZone);
    const distance = calculateDistance(
        currentLat,
        currentLon,
        wardCoords.latitude,
        wardCoords.longitude
    );

    const isValid = distance <= allowedRadius;

    return {
        isValid,
        distance: Math.round(distance),
        message: isValid
            ? `Location verified. You are ${Math.round(distance)}m from your assigned ward.`
            : `Location not verified. You are ${Math.round(distance)}m away from your assigned ward (allowed: ${allowedRadius}m).`,
        wardCoordinates: wardCoords
    };
}

module.exports = {
    calculateDistance,
    getWardCoordinates,
    verifyLocationInWard
};


