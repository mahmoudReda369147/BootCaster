import mongoose from "mongoose";

const voiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    voiceUrl: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

// Check if the model already exists before creating it
const Voice = mongoose.models.Voice || mongoose.model("Voice", voiceSchema);

export default Voice;
