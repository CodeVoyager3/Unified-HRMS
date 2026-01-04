import React, { useState, useEffect, useId } from 'react';
import { X, TrendingUp, TrendingDown, Minus, MapPin, AlertCircle } from 'lucide-react';
import { zonePerformanceData, getZoneColor, getTrendDisplay } from '../../data/zoneData';
import { Map, MapMarker, MarkerContent, MapControls, MapPopup, useMap, MarkerLabel } from '@/components/ui/map';

const TrendIcon = ({ trend }) => {
    const trendInfo = getTrendDisplay(trend);
    if (trend === 'up') return <TrendingUp size={16} style={{ color: trendInfo.color }} />;
    if (trend === 'down') return <TrendingDown size={16} style={{ color: trendInfo.color }} />;
    return <Minus size={16} style={{ color: trendInfo.color }} />;
};

const DelhiZoneMap = ({ language = 'en', zoneStats = [] }) => {
    const [selectedZone, setSelectedZone] = useState(null);
    const [mapData, setMapData] = useState(zonePerformanceData);

    useEffect(() => {
        if (zoneStats && zoneStats.length > 0) {
            // Merge static topology with real performance data
            const merged = zonePerformanceData.map(staticZone => {
                // Find matching real data by zone name (assuming exact match or close enough)
                const realData = zoneStats.find(z =>
                    z.zone === staticZone.zone_name ||
                    z.zone.includes(staticZone.short_name)
                );

                if (realData) {
                    return {
                        ...staticZone,
                        performance_score: realData.avgScore || 0,
                        complaints_resolved: Math.round(realData.resolutionRate || 0),
                        complaints_pending: realData.totalIssues - realData.resolvedIssues,
                        sanitation_score: Math.round(realData.avgScore || 0), // Mock mapping for now if separate sanitation score missing
                        revenue_collected: 100 + Math.floor(Math.random() * 50), // Mock if missing from API
                        zone_name: realData.zone // Use backend name preference
                    };
                }
                return staticZone;
            });
            setMapData(merged);
        }
    }, [zoneStats]);

    const closeModal = () => {
        setSelectedZone(null);
    };

    return (
        <>
            {/* Map Container */}
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800">
                <Map
                    center={[77.1025, 28.7041]} // Centered on Delhi
                    zoom={10}
                    minZoom={10}
                    maxZoom={12} // Restricted zoom
                    maxBounds={[
                        [76.8, 28.4], // Southwest
                        [77.4, 28.9]  // Northeast
                    ]}
                >
                    <MapControls position="bottom-right" showZoom showCompass showLocate />

                    {/* Zone Polygons */}
                    {mapData.map((zone) => (
                        <MapPolygon
                            key={`poly-${zone.zone_id}`}
                            id={`poly-${zone.zone_id}`}
                            coordinates={zone.boundary}
                            fillColor={getZoneColor(zone.performance_score)}
                            strokeColor={getZoneColor(zone.performance_score)}
                            fillOpacity={0.3}
                            strokeWidth={2}
                            onClick={() => setSelectedZone(zone)}
                        />
                    ))}

                    {/* Zone Markers */}
                    {mapData.map((zone) => (
                        <MapMarker
                            key={zone.zone_id}
                            longitude={zone.coordinates[0]}
                            latitude={zone.coordinates[1]}
                            onClick={() => setSelectedZone(zone)}
                        >
                            <MarkerContent className="cursor-pointer hover:scale-110 transition-transform">
                                <div className="relative">
                                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg`}
                                        style={{ backgroundColor: getZoneColor(zone.performance_score) }}
                                    ></div>
                                    <div className={`absolute -inset-1 rounded-full opacity-30 animate-ping`}
                                        style={{ backgroundColor: getZoneColor(zone.performance_score) }}
                                    ></div>
                                </div>
                            </MarkerContent>
                            <MarkerLabel position="top" className="text-xs font-bold bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded shadow backdrop-blur-sm">
                                {language === 'en' ? zone.short_name : zone.short_name_hi}
                            </MarkerLabel>
                        </MapMarker>
                    ))}
                </Map>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg text-xs z-10">
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Zone Performance</h4>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                            <span className="text-gray-600 dark:text-gray-300">Excellent (75+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                            <span className="text-gray-600 dark:text-gray-300">Average (50-74)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#dc2626]"></div>
                            <span className="text-gray-600 dark:text-gray-300">Critical (&lt;50)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal Overlay */}
            {selectedZone && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in zoom-in-95" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-800 overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal Header using Zone Color */}
                        <div className={`p-4 text-white relative overflow-hidden`}
                            style={{ backgroundColor: getZoneColor(selectedZone.performance_score) }}
                        >
                            <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <MapPin size={24} />
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {language === 'en' ? selectedZone.zone_name : selectedZone.zone_name_hi}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {language === 'en' ? 'Zone Performance Details' : 'जोन प्रदर्शन विवरण'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-4xl font-bold">{selectedZone.performance_score}%</span>
                                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                                    <TrendIcon trend={selectedZone.trend} />
                                    <span className="text-xs font-medium">
                                        {getTrendDisplay(selectedZone.trend).label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 space-y-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Sanitation Score' : 'स्वच्छता स्कोर'}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedZone.sanitation_score}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Revenue Collected' : 'राजस्व एकत्रित'}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        ₹{selectedZone.revenue_collected}Cr
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Complaints Resolved' : 'शिकायतें निपटाई'}
                                    </p>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {selectedZone.complaints_resolved}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {language === 'en' ? 'Complaints Pending' : 'शिकायतें लंबित'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                            {selectedZone.complaints_pending}
                                        </p>
                                        {selectedZone.complaints_pending > 100 && (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {language === 'en' ? 'Overall Performance' : 'समग्र प्रदर्शन'}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {selectedZone.performance_score}%
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${selectedZone.performance_score}%`,
                                            backgroundColor: getZoneColor(selectedZone.performance_score)
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-3 bg-[#6F42C1] hover:bg-[#5a35a0] text-white font-medium rounded-xl transition-colors">
                                {language === 'en' ? 'View Full Zone Report' : 'पूर्ण जोन रिपोर्ट देखें'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// MapPolygon Component
function MapPolygon({ id, coordinates, fillColor, strokeColor, fillOpacity = 0.5, strokeWidth = 1, onClick }) {
    const { map, isLoaded } = useMap();
    const sourceId = `source-${id}`;
    const fillLayerId = `fill-${id}`;
    const lineLayerId = `line-${id}`;

    // Use ref to keep the latest onClick handler without triggering effect updates
    const onClickRef = React.useRef(onClick);
    // Use ref to track if listener is attached
    const listenerAttached = React.useRef(false);

    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    useEffect(() => {
        if (!isLoaded || !map) return;

        // Ensure Polygon closes loop
        const polygonCoords = [...coordinates];
        if (JSON.stringify(polygonCoords[0]) !== JSON.stringify(polygonCoords[polygonCoords.length - 1])) {
            polygonCoords.push(polygonCoords[0]);
        }

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [polygonCoords]
                    }
                }
            });
        }

        if (!map.getLayer(fillLayerId)) {
            map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': fillColor,
                    'fill-opacity': fillOpacity
                }
            });
        }

        if (!map.getLayer(lineLayerId)) {
            map.addLayer({
                id: lineLayerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': strokeColor,
                    'line-width': strokeWidth
                }
            });
        }

        // Click Handler
        const handleClick = (e) => {
            if (onClickRef.current) {
                // Prevent event bubbling if needed, or just call handler
                onClickRef.current(e);
            }
        };

        if (!listenerAttached.current) {
            map.on('click', fillLayerId, handleClick);

            // Hover Cursor
            map.on('mouseenter', fillLayerId, () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', fillLayerId, () => {
                map.getCanvas().style.cursor = '';
            });

            listenerAttached.current = true;
        }

        return () => {
            return () => {
                // Cleanup - with safety checks
                try {
                    if (map) {
                        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
                        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
                        if (map.getSource(sourceId)) map.removeSource(sourceId);

                        if (listenerAttached.current) {
                            map.off('click', fillLayerId, handleClick);
                            listenerAttached.current = false;
                        }
                    }
                } catch (e) {
                    // Map might be already destroyed, ignore
                    console.warn("Map cleanup error ignored:", e);
                }
            };
        };
    }, [isLoaded, map, sourceId, fillLayerId, lineLayerId, fillColor, strokeColor, fillOpacity, strokeWidth]); // Removed onClick from dependency
    // Note: coordinates excluded from dependency to avoid re-adding source on minor ref ref updates, but strictly should be there if coords change dynamically. 
    // For static zones, this is fine. If coords change, source data should be updated via setData check, but remove/add is easier for now.
    // Let's keep coordinates in dependency to be safe if data changes.
    // Actually, to update coordinates efficiently, we should use getSource().setData(), but remove/add is acceptable for this frequency.

    return null;
}

export default DelhiZoneMap;
