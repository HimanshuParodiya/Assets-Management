import mongoose from 'mongoose';
// This will be used to keep track of the sequence number for ticket IDs.
const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
