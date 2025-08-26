const bcrypt = require("bcrypt");
const path = require("path")
const otpGenerator = require('otp-generator');
const jwt = require("jsonwebtoken");
const { mkdir } = require('node:fs/promises');
const jetpack = require("fs-jetpack");
const fs = require("fs");
const helper = {}
const saltnumber = 10
const secretkey = "RobertRDalgadoverses"
helper.createPassword = async (password) => {
    return await bcrypt.hash(password, saltnumber);
}
helper.comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}
helper.compareprotectedLinksPassword = function (candidate) {
    return bcrypt.compare(candidate, this.protectedLinksPassword);
};
helper.generateTokken = (Data) => {
    return jwt.sign(Data, secretkey, { expiresIn: "24h" })
}
helper.otp = () => {
    const response = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    return response
}
helper.applyPagination = (skip, limit) => {
    return {
        $facet: {
            paginatedResults: [
                { $skip: skip },
                { $limit: limit }
            ],
            totalCount: [{ $count: "total" }]
        }
    };
};
helper.getFilteredTopic = (language) => ({
    $filter: {
        input: "$topic",
        as: "t",
        cond: { $eq: ["$$t.language", language] },
    },
});

helper.moveFileFromFolder = async (filename, targetFolder) => {
    if (!filename) return null;
    const tempDir = path.join(__dirname, "../../public/tempUploads");
    const targetDir = path.join(__dirname, "../../public", targetFolder);
    const sourcePath = path.join(tempDir, filename);
    if (!fs.existsSync(sourcePath)) {
        console.log(`File not found: ${sourcePath}`);
        return null;
    }
    const alreadyRenamed = /^\d{13}___/.test(filename);
    const newFilename = alreadyRenamed ? filename : `${Date.now()}___${filename}`;
    const destinationPath = path.join(targetDir, newFilename);
    if (!fs.existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
    }
    fs.renameSync(sourcePath, destinationPath);
    return newFilename;
};
module.exports = helper