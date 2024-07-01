const axios = require('axios');

async function fetchDistanceMatrix(pickupLat, pickupLong, dropLat, dropLong, apiKey) {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

    try {

        const response = await axios.get(url, {
            params: {
                origins: `${pickupLat},${pickupLong}`,
                destinations: `${dropLat},${dropLong}`,
                key: apiKey,
            },
        });

        // Extract relevant data from the response
        const distanceMatrixData = response.data;
        
        return distanceMatrixData;
    } catch (error) {
        console.error('Error fetching distance matrix:', error);
        throw error; // Handle errors as needed
    }
}

module.exports = {fetchDistanceMatrix};
