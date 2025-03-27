import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ItineraryList.css'; // Import the CSS file

const ItineraryList = () => {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch itineraries
    const fetchItineraries = async () => {
        try {
            const response = await axios.get('/api/v1/itineraries'); // Fetch itineraries
            setItineraries(response.data);
            console.log(response);
        } catch (error) {
            setError("Error fetching itineraries. Please try again later.");
            console.error("Error fetching itineraries:", error);
        }
    };

    // ComponentDidMount equivalent
    useEffect(() => {
        fetchItineraries();
    }, []);

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    // Pagination logic
    const totalPages = Math.ceil(itineraries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedItineraries = itineraries.slice(startIndex, startIndex + itemsPerPage);

    // Render loading state or error message
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="itinerary-list-container">
            <h1>Itinerary List</h1>
            <div className="items-per-page">
                <label htmlFor="itemsPerPage">Items per page:</label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            {selectedItineraries.length === 0 ? (
                <p>No itineraries available.</p>
            ) : (
                <>
                    <table className="itinerary-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Duration</th>
                                <th>Length (KM)</th>
                                <th>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItineraries.map((itinerary) => (
                                <tr key={itinerary.id}>
                                    <td>{itinerary.code}</td>
                                    <td>{itinerary.name}</td>
                                    <td>{itinerary.poi_start_id || 'N/A'}</td>
                                    <td>{itinerary.poi_end_id || 'N/A'}</td>
                                    <td>{itinerary.itineraryTime || 'N/A'}</td>
                                    <td>{itinerary.length || 'N/A'}</td>
                                    <td>{itinerary.difficulty.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ItineraryList;
