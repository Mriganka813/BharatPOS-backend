const express = require('express');
const router = express.Router();
const ForceUpdate = require('../models/forceUpdateModel');

// POST endpoint to set forceUpdate value
router.post('/setForceUpdate', async (req, res) => {
    try {
        const { forceUpdate } = req.body;

        // Check if a record already exists
        let existingRecord = await ForceUpdate.findOne();

        if (existingRecord) {
            // Update the existing record
            existingRecord.forceUpdate = forceUpdate;
            await existingRecord.save();
            res.status(200).json({ message: 'Force update value updated successfully!', data: existingRecord });
        } else {
            // Create a new record
            const updateValue = new ForceUpdate({ forceUpdate });
            await updateValue.save();
            res.status(200).json({ message: 'Force update value set successfully!', data: updateValue });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error setting force update value', error });
    }
});


// GET endpoint to retrieve the latest forceUpdate value
router.get('/getForceUpdate', async (req, res) => {
    try {
        const latestUpdate = await ForceUpdate.findOne();
        const status = latestUpdate.forceUpdate
        res.send(status)
    } catch (error) {
        res.status(500).send('Error retrieving force update value');
    }
});


module.exports = router;
