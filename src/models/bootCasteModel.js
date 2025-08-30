import mongoose from "mongoose";

const bootCasteSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    bootcastName: {
        type: String,
        required: true,
    },
    name1: {
        type: String,
        required: true,
    },
    name2: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
    isPupleshed: {
        type: Boolean,
        default: false,
    },
    //الشخصيه
    characters: {
        type: [String],

        default: ["Puck", "Kore"],
    },
    //المحتوى الموجود في البوت كاست
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// إنشاء النموذج بشكل آمن مع التحقق من الاتصال
let BootCaste;

try {
    // التحقق من وجود النموذج بالفعل
    BootCaste =
        mongoose.models.BootCaste ||
        mongoose.model("BootCaste", bootCasteSchema);
} catch (error) {
    // إذا فشل إنشاء النموذج، أنشئه مرة أخرى
    BootCaste = mongoose.model("BootCaste", bootCasteSchema);
}

export default BootCaste;
