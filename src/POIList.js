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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPOIs = async () => {
            try {
                const response = await axios.get('/api/v1/pois', {
                    withCredentials: true, 
                    headers: {
                        "Content-Type": "application/json",
                            // "Cookie": "CF_Authorization=eyJhbGciOiJSUzI1NiIsImtpZCI6IjRkMjMxNmI2OThiYzIwZGY5M2VhODEwYTNjODRjZDcwYzFlZjY4YmRmMjBiYjhjNDIwNGQyNmVlODQ2NjJlMmIifQ.eyJhdWQiOlsiNTUwZTJjMjk2YjlkZWY2YjRmMmFlYjk5NGUwMmMyNTRmODE4ODYxZWJkYzk3MjlkODQxNWY1Y2U0MzU0ZmFkNSJdLCJlbWFpbCI6InJpY2tzb24ucGVyZWlyYUBnc3NpLml0IiwiZXhwIjoxNzQ1NDQwMDE2LCJpYXQiOjE3NDI4MTIwMTYsIm5iZiI6MTc0MjgxMjAxNiwiaXNzIjoiaHR0cHM6Ly9jc2dzc2kuY2xvdWRmbGFyZWFjY2Vzcy5jb20iLCJ0eXBlIjoiYXBwIiwiaWRlbnRpdHlfbm9uY2UiOiI2dGFvTlVubnRsUUFKa2tvIiwic3ViIjoiYzkxMDRmYzAtODRiYS01NTk1LWJiOTktMWRlZTM5ZjZhMjZhIiwiY291bnRyeSI6IklUIn0.J6NfgIMH49lvo1LOpcyw5UR8mJaqppQIpjs4kZSgPd1PNPCipaDwt_DlHy2pnC4rKEBkj5cP0aJvuxJadj3zYwetsiBggUErVGuR5vOa3MAR6jHMv5uWCAoc8EolXJzpyUVfng-sE4OnCwAlgBKeUQnvSFHyZPijetyr4xcBWCaPnopHlPtTj9ZIxxlNXErfsktgByj_y4uAYkVEpG4lu4VjGNCuZeW2d_Rljf-4QmmLaNRW7gAin1Dfsc4VY3w4Gt1XuofKhdDl7LbLWYpWUF0y0N22iW5DU_usl8rGwYHhnZQLRHyqd1yS44bJBtRZ4tQQBQhVnyVNvdq3DWusZA; JSESSIONID=F6D395D67199C6F327D688E7FB61375A; cf_clearance=3nmCOy8WcoFH06rnp1Jsl7ypshKOzZFK0P2CrZFekDw-1742925377-1.2.1.1-CskBbs7XVe32xCsD65BgPiCOxOTA11PlspvOUAK8MFWNxus7oG0kBl8y0yWxOEJqXY67U4tvXZGk4KsIjDi1.ryd.xaVraHkhdEOIkEZNUKOFhwawEP2UJmmr6_Jch5uhtpooT2MCrTAK96sVaVIRXyHWiPuAEw3BVApLGas7ZXlpdYv00kv2T2R37C.5.nTahnmKhqWzphVl9aCM7UI5zp68hYZRT8tHOR1fXESqHC7Zm466iPjDcBtkE8Cop4EgVl0KONbByCnQajELEzNQIJEF1ulv.KEKJ40hckHLnV8vrzzlL9lGZdv.VzFzj3qyPimsLNVqJnzHnmAPZ_P46GJaYb14RotBep4pMDLZ8E",
                    }
                });
                setPois(response.data);
                fetchParametersForPOIs(response.data); 
            } catch (error) {
                setError('Error fetching POIs');
                console.error('Error fetching POIs:', error);
            }
        };
    
        fetchPOIs();
    }, []);
    // useEffect(() => {
    //     const fetchPOIs = async () => {
    //       try {
    //         const response = await axios.get(
    //           'http://localhost:8080/https://pms.rasta-project.tech/api/v1/pois',
    //           {
    //             withCredentials: true,
    //             headers: {
    //               "Content-Type": "application/json"
    //             }
    //           }
    //         );
    //         setPois(response.data);
    //       } catch (error) {
    //         console.error('Error:', {
    //           status: error.response?.status,
    //           data: error.response?.data,
    //           headers: error.response?.headers
    //         });
    //         setError('Failed to load data');
    //       }
    //     };
    //     fetchPOIs();
    //   }, []);

    const fetchParametersForPOIs = async (pois) => {
        const parameters = {};
        for (const poi of pois) {
            try {
                const response = await axios.get(`/api/v1/pois/${poi.id}/parameters`);
                parameters[poi.id] = response.data; 
            } catch (error) {
                console.error(`Failed to fetch parameters for POI ${poi.id}:`, error);
                parameters[poi.id] = [];
            }
        }
        setPoiParameters(parameters);
    };
    const handleCardClick = (poi) => {
        setSelectedPOIs((prevSelected) => {
            if (prevSelected.some(selected => selected.id === poi.id)) {

                return prevSelected.filter((selected) => selected.id !== poi.id);
            } else if (prevSelected.length < 5) {
                return [...prevSelected, poi];
            } else {
                setErrorMessage('You can only select up to 5 POIs.');
                return prevSelected; 
            }
        });
    };
    
    const handleNextStep = () => {
        console.log('Navigating with selected POIs:', selectedPOIs); 
        navigate('/preferences', { state: { selectedPOIs } }); 
    };
    

    if (error) {
        return <div>{error}</div>;
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

                    const parameters = poiParameters[poi.id] || [];

                    const quietness = parameters.find((param) => param.name === 'quietness')?.name || 'N/A';
                    const weather = parameters.find((param) => param.name === 'weather')?.name || 'N/A';

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
                            />
                            <div className="poi-details">
                                <h3 className="poi-name">{poi.name}</h3>
                                <p className="poi-country">{poi.country}</p>
                                <p>Quiet Level: {quietness}</p>
                                <p className="poi-weather">Weather: {weather}</p>
                            </div>
                            {selectedPOIs.includes(poi.name) && (
                                <div className="selected-overlay"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button
                className="next-step-button"
                disabled={selectedPOIs.length < 3}
                onClick={handleNextStep}
            >
                Next Step
            </button>
        </div>
    );
};

export default POIList;
