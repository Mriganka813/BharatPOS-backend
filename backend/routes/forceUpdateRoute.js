const express = require('express');
const router = express.Router();
const ForceUpdate = require('../models/forceUpdateModel');

// POST endpoint to set forceUpdate value
router.post('/setForceUpdate', async (req, res) => {
    try {
        const { forceUpdate } = req.body;
        const updateValue = new ForceUpdate({ forceUpdate });
        await updateValue.save();
        res.status(200).json({ message: 'Force update value set successfully!', data: updateValue });
    } catch (error) {
        res.status(500).json({ message: 'Error setting force update value', error });
    }
});

// GET endpoint to retrieve the latest forceUpdate value
router.get('/getForceUpdate', async (req, res) => {
    try {
        const latestUpdate = await ForceUpdate.findOne().sort({ createdAt: -1 });
        if (latestUpdate) {
            res.status(200).json({ message: 'Latest force update value retrieved successfully!', forceUpdate: latestUpdate.forceUpdate });
        } else {
            res.status(404).json({ message: 'No force update value found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving force update value', error });
    }
});

module.exports = router;
