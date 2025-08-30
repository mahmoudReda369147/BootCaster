import cron from "node-cron";
import mongoose from "mongoose";
//import the keys model
import Keys from "./src/models/keysModel.js";

import dotenv from "dotenv";
dotenv.config();

cron.schedule(
    "0 0 * * *",
    async () => {
        mongoose
            .connect(process.env.MONGODB_URI)
            .catch((error) => console.error("error conection", error));
        const result = await Keys.updateMany({}, { $set: { usage: 0 } });
        console.log(
            `Updated ${result.modifiedCount} keys and ran at ${new Date()}`
        );
        // set the time zone to Eastern Time (afreca & cairo)});
    },
    { timezone: "Etc/UTC" }
);
