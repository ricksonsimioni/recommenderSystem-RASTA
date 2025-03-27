import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Preferences.css';
import wind from './assets/wind.png';
import noWind from './assets/noWind.png';
import strongWind from './assets/strongWind.png';
import goodWeather from './assets/good-weather.png';
import drizzle from './assets/drizzle.png';
import storm from './assets/storm.png';
import silence from './assets/shh.png';
import noise from './assets/conversation.png';
import easyDifficulty from './assets/trekkingEasy.png';
import mediumDifficulty from './assets/trekkingMedium.png';
import hardDifficulty from './assets/trekkingHard.png';
import shortDuration from './assets/clock-short.png';
import mediumDuration from './assets/clock-medium.png';
import longDuration from './assets/clock-hard.png';

const Preferences = () => {
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [duration, setDuration] = useState('');
    const [quietPlace, setQuietPlace] = useState(false);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [windCondition, setWindCondition] = useState(''); 
    const [rainCondition, setRainCondition] = useState(''); 
    const [quietnessCondition, setQuietnessCondition] = useState('');
    const { state } = useLocation();
    const selectedPOIs = state?.selectedPOIs || []; // Retrieve passed POIs
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/v1/pois/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchDifficulties = async () => {
            try {
                const response = await axios.get('/api/v1/itineraries/difficulties');
                setDifficulties(response.data);
            } catch (error) {
                console.error('Error fetching difficulties:', error);
            }
        };

        fetchDifficulties();
        fetchCategories();
    }, []);

    const handleCategoryChange = (event) => {
        const categoryName = event.target.value;
        if (categoryName && !selectedCategories.includes(categoryName)) {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    const handleRemoveCategory = (category) => {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/recommendation', {
            state: {
                fitnessLevel,
                duration,
                windCondition,
                rainCondition,
                quietPlace,
                selectedPOIs, // Pass selected POIs
            },
        });
    };

    const toggleQuietPlace = () => setQuietPlace((prevState) => !prevState);

    return (
        <div className="preferences-container">
            <h1>Select your preferences</h1>
            <form onSubmit={handleSubmit}>
                {/* <div className="selected-pois">
                    <h3>Selected POIs:</h3>
                    <ul>
                        {selectedPOIs.map((poi, index) => (
                            <li key={index}>{poi}</li>
                        ))}
                    </ul>
                </div> */}
                {/* <div className="form-group">
                    <label htmlFor="fitnessLevel">Fitness Level:</label>
                    <select
                        id="fitnessLevel"
                        value={fitnessLevel}
                        onChange={(e) => setFitnessLevel(e.target.value)}
                    >
                        <option value="" disabled>Select difficulty</option>
                        {difficulties.map((difficulty, index) => (
                            <option key={index} value={difficulty.acronym}>
                                {difficulty.acronym} - {difficulty.name}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div className="form-group">
                    <label htmlFor="duration">Duration:</label>
                    {/* <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 30"
                        required
                    /> */}
                    <div className="weather-options">
                        <div
                            className={`weather-option ${duration === 60 ? 'active' : ''}`}
                            onClick={() => setDuration(60)}
                        >
                            <img src={shortDuration} alt="Short Duration" />
                            <span>I prefer easy, relaxed activities with minimal physical effort.</span>
                        </div>
                        <div
                            className={`weather-option ${duration === 180 ? 'active' : ''}`}
                            onClick={() => setDuration(180)}
                        >
                            <img src={mediumDuration} alt="Medium Duration" />
                            <span>I enjoy moderate activities that require some physical effort.</span>
                        </div>
                        <div
                            className={`weather-option ${duration === 360 ? 'active' : ''}`}
                            onClick={() => setDuration(360)}
                        >
                            <img src={longDuration} alt="Long Duration" />
                            <span>I love challenging activities that push my physical limits.</span>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Fitness Level:</label>
                    <div className="weather-options">
                        <div
                            className={`weather-option ${fitnessLevel === 'T' ? 'active' : ''}`}
                            onClick={() => setFitnessLevel('T')}
                        >
                            <img src={easyDifficulty} alt="Low Fitness" />
                            <span>I prefer easy, relaxed activities with minimal physical effort.</span>
                        </div>
                        <div
                            className={`weather-option ${fitnessLevel === 'E' ? 'active' : ''}`}
                            onClick={() => setFitnessLevel('E')}
                        >
                            <img src={mediumDifficulty} alt="Medium Fitness" />
                            <span>I enjoy moderate activities that require some physical effort.</span>
                        </div>
                        <div
                            className={`weather-option ${fitnessLevel === 'EE' ? 'active' : ''}`}
                            onClick={() => setFitnessLevel('EE')}
                        >
                            <img src={hardDifficulty} alt="High Fitness" />
                            <span>I love challenging activities that push my physical limits.</span>
                        </div>
                    </div>
                </div>


                {/* Wind Condition Selector */}
                <div className="form-group">
                    <label>Wind Conditions:</label>
                    <div className="weather-options">
                        <div
                            className={`weather-option ${windCondition === 'no-wind' ? 'active' : ''}`}
                            onClick={() => setWindCondition('no-wind')}
                        >
                            <img src={noWind} alt="No Wind" />
                            <span>I would rather to go a place with no wind.</span>
                        </div>
                        <div
                            className={`weather-option ${windCondition === 'normal-wind' ? 'active' : ''}`}
                            onClick={() => setWindCondition('normal-wind')}
                        >
                            <img src={wind} alt="Normal Wind" />
                            <span>Light wind is not a problem for me.</span>
                        </div>
                        <div
                            className={`weather-option ${windCondition === 'strong-wind' ? 'active' : ''}`}
                            onClick={() => setWindCondition('strong-wind')}
                        >
                            <img src={strongWind} alt="Heavy Wind" />
                            <span>I would love an adventure through heavy winds.</span>
                        </div>
                    </div>
                </div>

                {/* Rain Condition Selector */}
                <div className="form-group">
                    <label>Rain Conditions:</label>
                    <div className="weather-options">
                        <div
                            className={`weather-option ${rainCondition === 'no-rain' ? 'active' : ''}`}
                            onClick={() => setRainCondition('no-rain')}
                        >
                            <img src={goodWeather} alt="No Rain" />
                            <span>I would rather to go a place with no rain.</span>
                        </div>
                        <div
                            className={`weather-option ${rainCondition === 'light-rain' ? 'active' : ''}`}
                            onClick={() => setRainCondition('light-rain')}
                        >
                            <img src={drizzle} alt="Light Rain" />
                            <span>Light rain is not a problem for me.</span>
                        </div>
                        <div
                            className={`weather-option ${rainCondition === 'heavy-rain' ? 'active' : ''}`}
                            onClick={() => setRainCondition('heavy-rain')}
                        >
                            <img src={storm}  alt="Heavy Rain" />
                            <span>I would love an adventure under the heavy rain.</span>
                        </div>
                    </div>
                </div>

                {/* Rain Condition Selector */}
                <div className="form-group">
                    <label>What is your preference about quietness?:</label>
                    <div className="weather-options">
                        <div
                            className={`weather-option ${quietnessCondition === 'quiet' ? 'active' : ''}`}
                            onClick={() => setQuietnessCondition('quiet')}
                        >
                            <img src={silence} alt="I would rather a quieter place." />
                            <span>I would rather a quieter place.</span>
                        </div>
                        <div
                            className={`weather-option ${quietnessCondition === 'no-quiet' ? 'active' : ''}`}
                            onClick={() => setQuietnessCondition('no-quiet')}
                        >
                            <img src={noise} alt="I do not care about the noise." />
                            <span>I do not care about the noise.</span>
                        </div>
                    </div>
                </div>

                <button type="submit">Submit Preferences</button>
            </form>
        </div>
    );
};

export default Preferences;