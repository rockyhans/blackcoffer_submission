import dotenv from "dotenv";
import fs from "fs";

import connectDB from "./src/config/db.js";
import Data from "./src/models/Data.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        const jsonData = JSON.parse(
            fs.readFileSync("./jsondata.json", "utf-8")
        );

        // For development only: Clear existing data before seeding since the provided dataset is static.
        await Data.deleteMany();

        await Data.insertMany(jsonData);

        console.log("Database Seeded Successfully");

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

seedDatabase();