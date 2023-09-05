const mongoose = require('mongoose');

const forceUpdateSchema = new mongoose.Schema({
    forceUpdate: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const ForceUpdate = mongoose.model('ForceUpdate', forceUpdateSchema);

module.exports = ForceUpdate;
