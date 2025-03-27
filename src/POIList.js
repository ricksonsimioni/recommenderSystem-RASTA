import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/POIList.css';

const POIList = () => {
    const [pois, setPois] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPOIs, setSelectedPOIs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [poiParameters, setPoiParameters] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPOIs = async () => {
            try {
                const response = await axios.get('/api/v1/pois', {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                // console.log('Fetched POIs:', response.data); 
                setPois(response.data);
                fetchParametersForPOIs(response.data);
            } catch (error) {
                setError('Error fetching POIs');
                console.error('Error fetching POIs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPOIs();
    }, []);

    const fetchParametersForPOIs = async (pois) => {
        const parameters = {};
        for (const poi of pois) {
            try {
                // if (poi.id === 9) { //
                    const [peopleQtyRes, rainRes, tempRes, windRes] = await Promise.all([
                        axios.get(`/api/v1/pois/${poi.id}/parameters/peopleqty/value`, { withCredentials: true }),
                        axios.get(`/api/v1/pois/${poi.id}/parameters/rain/value`, { withCredentials: true }),
                        axios.get(`/api/v1/pois/${poi.id}/parameters/temp/value`, { withCredentials: true }),
                        axios.get(`/api/v1/pois/${poi.id}/parameters/wind/value`, { withCredentials: true })
                    ]);
    
                    parameters[poi.id] = {
                        peopleQty: peopleQtyRes.data?.value ?? peopleQtyRes.data ?? 'N/A',
                        rain: rainRes.data?.value ?? rainRes.data ?? 'N/A',
                        temperature: tempRes.data?.value ?? tempRes.data ?? 'N/A',
                        wind: windRes.data?.value ?? windRes.data ?? 'N/A'
                    };
                // } else { //
                //     parameters[poi.id] = {
                //         peopleQty: 'N/A',
                //         rain: 'N/A',
                //         temperature: 'N/A',
                //         wind: 'N/A'
                //     };
                // }
            } catch (error) {
                console.error(`Failed to fetch parameters for POI ${poi.id}:`, error);
                parameters[poi.id] = {
                    peopleQty: 'N/A',
                    rain: 'N/A',
                    temperature: 'N/A',
                    wind: 'N/A'
                };
            }
        }
        setPoiParameters(parameters);
    };

    const handleCardClick = (poi) => {
        setSelectedPOIs((prevSelected) => {
            if (prevSelected.some(selected => selected.id === poi.id)) {
                return prevSelected.filter((selected) => selected.id !== poi.id);
            } else if (prevSelected.length < 5) {
                setErrorMessage('');
                return [...prevSelected, poi];
            } else {
                setErrorMessage('You can only select up to 5 POIs.');
                return prevSelected;
            }
        });
    };

    const handleNextStep = () => {
        navigate('/preferences', { state: { selectedPOIs } });
    };

    if (loading) {
        return <div className="loading">Loading POIs...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="poi-container">
            <h1 className="title">Select Your Favorite POIs</h1>
            <p className="subtitle">Click on up to 5 POIs you like the most to proceed.</p>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <div className="poi-list">
                {pois.map((poi) => {
                    const primaryImage = poi.primaryImage;
                    const imageUrl = primaryImage
                        ? `data:${primaryImage.type};base64,${primaryImage.content}`
                        : '/path/to/default/image.jpg';

                    const poiParams = poiParameters[poi.id] || {
                        peopleQty: 'N/A',
                        rain: 'N/A',
                        temperature: 'N/A',
                        wind: 'N/A'
                    };

                    // console.log(`Rendering POI ${poi.id} with params:`, poiParams); // Debug log

                    return (
                        <div
                            className={`poi-card ${selectedPOIs.some(selected => selected.id === poi.id) ? 'selected' : ''}`}
                            key={poi.id}
                            onClick={() => handleCardClick(poi)}
                        >
                            <img
                                src={imageUrl}
                                alt={poi.name}
                                className="poi-image"
                                onError={(e) => {
                                    e.target.src = '/path/to/default/image.jpg';
                                }}
                            />
                            <div className="poi-details">
                                {/* <h3 className="poi-name">ID: {poi.id} - {poi.name}</h3>  */}
                                <h3 className="poi-name">{poi.name}</h3> 
                                <p className="poi-country">{poi.country}</p>
                                <div className="poi-parameters">
                                    <p><strong>Visitors:</strong> {poiParams.peopleQty}</p>
                                    <p><strong>Rain:</strong> {poiParams.rain}%</p>
                                    <p><strong>Temp:</strong> {poiParams.temperature}°C</p>
                                    <p><strong>Wind:</strong> {poiParams.wind} km/h</p>
                                </div>
                            </div>
                            {selectedPOIs.some(selected => selected.id === poi.id) && (
                                <div className="selected-overlay">
                                    <span className="checkmark">✓</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                className={`next-step-button ${selectedPOIs.length < 3 ? 'disabled' : ''}`}
                disabled={selectedPOIs.length < 3}
                onClick={handleNextStep}
            >
                {selectedPOIs.length < 3 
                    ? `Select ${3 - selectedPOIs.length} more to continue` 
                    : 'Next Step'}
            </button>
        </div>
    );
};

export default POIList;