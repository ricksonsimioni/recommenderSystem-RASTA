import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/Recommendation.css';

const startIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const endIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const poiIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const Recommendations = () => {
    const { state } = useLocation();
    const { fitnessLevel, duration, selectedPOIs } = state; // Extract selected POIs
    const [recommendations, setRecommendations] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const mapRef = useRef(null);
    const defaultPosition = [41.808, 13.789];

    const convertTimeToMinutes = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 60 + minutes + Math.floor(seconds / 60);
    };

    const formatMinutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const haversineDistance = (coords1, coords2) => {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const [lat1, lon1] = coords1;
        const [lat2, lon2] = coords2;

        const R = 6371; // Earth's radius in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    const [pois, setPois] = useState([]);

    useEffect(() => {
        const fetchPOIs = async () => {
            try {
                const response = await axios.get('/api/v1/pois');
                console.log('Fetched POIs:', response.data); // Log fetched POIs
                setPois(response.data);
            } catch (error) {
                console.error('Error fetching POIs:', error);
            }
        };

        fetchPOIs();
    }, []);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await axios.get('/api/v1/itineraries');
                const itineraries = response.data;

                console.log('Selected POIs:', selectedPOIs); // Log selected POIs

                const filteredItineraries = itineraries
                    .map((itinerary) => {
                        const routeCoordinates = [];
                        try {
                            const mapData = JSON.parse(itinerary.map);
                            const lineString = mapData.features.find(
                                (feature) => feature.geometry.type === 'LineString'
                            );
                            if (lineString) {
                                routeCoordinates.push(
                                    ...lineString.geometry.coordinates.map((coord) =>
                                        coord.slice(0, 2).reverse()
                                    )
                                );
                            }
                        } catch (error) {
                            console.error('Error parsing itinerary map data:', error);
                            return null;
                        }

                        console.log('Route Coordinates for Itinerary:', itinerary.id, routeCoordinates); // Log route coordinates

                        // Calculate how many selected POIs are close to the route
                        const nearbyPOICount = selectedPOIs.reduce((count, poi) => {
                            const isNearby = routeCoordinates.some((routeCoord) => {
                                const distance = haversineDistance(routeCoord, [poi.latitude, poi.longitude]);
                                console.log(`Distance between POI ${poi.id} and route point: ${distance} km`); // Log distance
                                return distance <= 2; // 2 km radius
                            });
                            return isNearby ? count + 1 : count;
                        }, 0);

                        return {
                            ...itinerary,
                            nearbyPOICount, // Add the count of nearby POIs
                            routeCoordinates, // Store route coordinates for later use
                        };
                    })
                    .filter((itinerary) => {
                        if (!itinerary) return false;

                        // Filter itineraries based on fitness level, duration, and at least one nearby POI
                        const itineraryDuration = convertTimeToMinutes(itinerary.itineraryTime);
                        return (
                            itinerary.nearbyPOICount > 0 && // At least one POI is nearby
                            itinerary.difficulty?.acronym === fitnessLevel &&
                            Math.abs(itineraryDuration - duration) <= 30 // Allow a 30-minute difference
                        );
                    });

                console.log('Filtered Itineraries:', filteredItineraries); // Log filtered itineraries

                // Sort itineraries by the number of nearby POIs (descending)
                filteredItineraries.sort((a, b) => b.nearbyPOICount - a.nearbyPOICount);

                if (filteredItineraries.length === 0) {
                    setMessage('No itineraries matched your preferences. Showing closest matches.');
                    setRecommendations(
                        itineraries
                            .sort(
                                (a, b) =>
                                    Math.abs(convertTimeToMinutes(a.itineraryTime) - duration) -
                                    Math.abs(convertTimeToMinutes(b.itineraryTime) - duration)
                            )
                            .slice(0, 5)
                    );
                } else {
                    setRecommendations(filteredItineraries.slice(0, 5));
                    setMessage('');
                }
            } catch (error) {
                console.error('Error fetching itineraries:', error);
                setError('Failed to fetch recommendations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, [fitnessLevel, duration, selectedPOIs]);

    const handleViewOnMap = (itinerary) => {
        try {
            const mapData = JSON.parse(itinerary.map);
            const startPoint = mapData.features.find((feature) => feature.properties.name === 'Partenza');
            const endPoint = mapData.features.find((feature) => feature.properties.name === 'Arrivo');
            const lineString = mapData.features.find((feature) => feature.geometry.type === 'LineString');

            if (!lineString || !startPoint || !endPoint) {
                console.error('Necessary map data is missing.');
                setSelectedItinerary(null);
                return;
            }

            const coordinates = lineString.geometry.coordinates;

            setSelectedItinerary({
                ...itinerary,
                startPoint: startPoint.geometry.coordinates.slice(0, 2).reverse(),
                endPoint: endPoint.geometry.coordinates.slice(0, 2).reverse(),
                coordinates: coordinates.map((coord) => coord.slice(0, 2).reverse()),
                startName: startPoint.properties.description,
                endName: endPoint.properties.description,
            });

            if (mapRef.current) {
                const bounds = coordinates.map((coord) => coord.slice(0, 2).reverse());
                mapRef.current.flyToBounds(bounds, { padding: [50, 50] });
            }
        } catch (error) {
            console.error('Error parsing map data:', error);
            setSelectedItinerary(null);
        }
    };

    return (
        <div className="recommendations-container">
            <h1>Recommendations</h1>
            {loading ? (
                <p>Loading recommendations...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    {message && <p className="notification">{message}</p>}
                    {recommendations.length === 0 ? (
                        <p>No recommendations found.</p>
                    ) : (
                        <div className="recommendation-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Difficulty</th>
                                        <th>Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recommendations.map((recommendation) => {
                                        let startName = 'Unknown';
                                        let endName = 'Unknown';
                                        try {
                                            const mapData = JSON.parse(recommendation.map);
                                            const startPoint = mapData.features.find(
                                                (feature) => feature.properties.name === 'Partenza'
                                            );
                                            const endPoint = mapData.features.find(
                                                (feature) => feature.properties.name === 'Arrivo'
                                            );

                                            if (startPoint && startPoint.properties.description) {
                                                startName = startPoint.properties.description;
                                            }
                                            if (endPoint && endPoint.properties.description) {
                                                endName = endPoint.properties.description;
                                            }
                                        } catch (error) {
                                            console.error('Error parsing map data for table:', error);
                                        }

                                        return (
                                            <tr key={recommendation.id}>
                                                <td>{recommendation.code}</td>
                                                <td>{recommendation.name}</td>
                                                <td>{startName}</td>
                                                <td>{endName}</td>
                                                <td>{recommendation.difficulty?.name || 'Unknown'}</td>
                                                <td>
                                                    {formatMinutesToTime(
                                                        convertTimeToMinutes(recommendation.itineraryTime)
                                                    )}
                                                </td>
                                                <td>
                                                    <button onClick={() => handleViewOnMap(recommendation)}>
                                                        View on Map
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="map-container">
                                <MapContainer
                                    ref={mapRef}
                                    center={defaultPosition}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: '400px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    {selectedItinerary && selectedItinerary.coordinates && (
                                        <>
                                            {selectedItinerary.startPoint && (
                                                <Marker position={selectedItinerary.startPoint} icon={startIcon}>
                                                    <Popup>Start: {selectedItinerary.startName}</Popup>
                                                </Marker>
                                            )}
                                            {selectedItinerary.endPoint && (
                                                <Marker position={selectedItinerary.endPoint} icon={endIcon}>
                                                    <Popup>End: {selectedItinerary.endName}</Popup>
                                                </Marker>
                                            )}
                                            <Polyline positions={selectedItinerary.coordinates} color="blue" />
                                        </>
                                    )}

                                    {pois
                                        .filter((poi) => selectedPOIs.some((selectedPOI) => selectedPOI.id === poi.id))
                                        .map((poi) => (
                                            <Marker key={poi.id} position={[poi.latitude, poi.longitude]} icon={poiIcon}>
                                                <Popup>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <strong>{poi.name}</strong>
                                                        <br />
                                                        <em>{poi.categories?.[0]?.name || 'Unknown Category'}</em>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Recommendations;