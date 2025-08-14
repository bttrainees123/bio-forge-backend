const mongoose = require("mongoose");
const userModel = require("../model/user.model");
const helper = require("../helper/helper");
const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;
const connectDB = async () => {
    try {
        await mongoose.connect(`${url}${dbName}`);
        console.log("Mongodb is connected",url+dbName)
        const alreadyExist = await userModel.findOne({email: "bioforge@gmail.com",});
        if (!alreadyExist) {
            const hashedPassword = await helper.createPassword("bioforge");
            const admin = new userModel({
                username: "bioforge",
                email: "bioforge@gmail.com",
                password: hashedPassword,
                type: "admin",
                status: "active",
            });
            await admin.save();
            console.log("SuperAdmin created successfully");
        }
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};
module.exports = connectDB;
