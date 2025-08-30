import mongoose from "mongoose";

const schema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    usage: {
        type: Number,
        default: 0,
    },
});

// Check if the model already exists before creating it
const Keys = mongoose.models.Keys || mongoose.model("Keys", schema);

export default Keys;
