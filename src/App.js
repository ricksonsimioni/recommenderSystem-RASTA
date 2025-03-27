import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Preferences from './Preferences';
import POIList from './POIList';
import ItineraryList from './ItineraryList';
import Recommendations from './Recommendation';

const App = () => {
    const [fitnessLevelId, setFitnessLevelId] = useState(null);
    const [duration, setDuration] = useState(null);
    const [selectedPOIs, setSelectedPOIs] = useState([]); // State to hold selected POIs

    return (
        <Router>
            <Routes>
                {/* Set POIList as the root route */}
                <Route 
                    path="/" 
                    element={<POIList setSelectedPOIs={setSelectedPOIs} />} 
                />
                <Route 
                    path="/preferences" 
                    element={
                        <Preferences 
                            setFitnessLevelId={setFitnessLevelId} 
                            setDuration={setDuration} 
                            selectedPOIs={selectedPOIs} // Pass selected POIs to Preferences
                        />
                    } 
                />
                <Route path="/itineraries" element={<ItineraryList />} />
                <Route 
                    path="/recommendation" 
                    element={<Recommendations fitnessLevelId={fitnessLevelId} duration={duration} />} 
                />
            </Routes>
        </Router>
    );
};

export default App;
