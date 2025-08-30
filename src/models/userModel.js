import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique: true,
    },
    plan: {
        type: String,
        default: "start",
        enum: ["start", "pro", "enterprise"],
        required: true,
    },
    
   
 botcastPlanNumber: {
    type: Number,
    required: true,
    default: 3,
 },
NumberOfBootCastesIsUsed: {
    type: Number,
    required: true,
    default: 0,
 },
 canCreateBootCastes: {
    type: Boolean,
    default: true,

 },

  
}, {
    timestamps: true  // Add timestamps to schema options
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;