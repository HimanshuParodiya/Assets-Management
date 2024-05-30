import mongoose from 'mongoose';


// Define a subSchema for specifications
const specificationSchema = new mongoose.Schema({
    power: {
        type: String,
        required: [true, 'Please add power specification']
    },
    voltage: {
        type: String,
        required: [true, 'Please add voltage specification']
    },
    current: {
        type: String,
        required: [true, 'Please add current specification']
    },
    speed: {
        type: String,
        required: [true, 'Please add speed specification']
    }
});

const assetSchema = new mongoose.Schema({
    motorId: {
        type: String,
        required: [true, 'Please add motor ID'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    manufacturer: {
        type: String,
        required: [true, 'Please add manufacturer'],
        trim: true,
    },
    modelNumber: {
        type: String,
        required: [true, 'Please add model number'],
        trim: true,
    },
    serialNumber: {
        type: String,
        required: [true, 'Please add serial number'],
        unique: true,
        trim: true,
    },
    installationDate: {
        type: Date,
        required: [true, 'Please add installation date']
    },
    lastMaintenanceDate: {
        type: Date,
        required: [true, 'Please add last maintenance date']
    },
    status: {
        type: String,
        required: [true, 'Please add status'],
        enum: ['Operational', 'Under Maintenance', 'Out of Service']
    },
    specifications: {
        type: [specificationSchema]
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
