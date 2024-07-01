const mongoose = require('mongoose');
const Request = require('./../model/request'); // Adjust the path according to your project structure

async function generateRequestNumber() {
    try {
        // Find the latest request
        const latestRequest = await Request.findOne().sort({ _id: -1 }).exec();

        console.log(latestRequest);

        let lastIndex;
        if (latestRequest) {
            const requestNumber = latestRequest.request_number.split('_');
            lastIndex = parseInt(requestNumber[1], 10);
        } else {
            lastIndex = 0;
        }

        const index = lastIndex + 1;

        // Construct the new request number
        const newRequestNumber = `TAXI_${index.toString().padStart(4, '0')}`;

        // Create or update the request
        if (latestRequest) {
            latestRequest.request_number = newRequestNumber;
            await latestRequest.save();
        } else {
            const newRequest = new Request({
                request_number: newRequestNumber
            });
            await newRequest.save();
        }

        console.log(newRequestNumber);

        return newRequestNumber;
    } catch (error) {
        console.error('Error generating request number:', error);
        throw error;
    }
}

module.exports = { generateRequestNumber };
