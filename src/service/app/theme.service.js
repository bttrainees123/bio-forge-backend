const helper = require('../../helper/helper');
const themeModel = require('../../model/theme.model');
const { default: mongoose } = require("mongoose");
const fs = require('fs');
const path = require('path');
const themeService = {};
themeService.add = async (request) => {
   if (request.body.themeImg) {
        await helper.moveFileFromFolder(request.body.themeImg, "themeImg");
    }
   return await themeModel.create(request.body);
    
};

themeService.update = async (request) => {
   const linkData = await themeModel.findOne({ _id: request?.body?._id });
       const oldImage = linkData.themeImg || "";
       const newImage = request.body.themeImg || "";
       const tempUploadPath = path.join("public", "tempUploads", newImage);
       if (newImage && fs.existsSync(tempUploadPath)) {
           await helper.moveFileFromFolder(newImage, "themeImg");
           if (oldImage && oldImage !== newImage) {
               const oldImagePath = path.join("public", "themeImg", oldImage);
               if (fs.existsSync(oldImagePath)) {
                   fs.unlink(oldImagePath, (err) => {
                       if (err) {
                           console.error(`Failed to delete old image: ${err.message}`);
                       } else {
                           console.log(`Deleted old image: ${oldImage}`);
                       }
                   });
               }
           }
           request.body.themeImg = newImage;
       }
       await themeModel.findByIdAndUpdate(
           { _id: new mongoose.Types.ObjectId(request?.body?._id) },
           request.body
       );
       return;
};
themeService.delete = async (request) => {
    const link = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
    if (link && link.themeImg) {
        const logoPath = path.join("public", "themeImg", link.themeImg);
        if (fs.existsSync(logoPath)) {
            fs.unlink(logoPath, (err) => {
                if (err) {
                    console.error(`Failed to delete themeImg: ${err.message}`);
                }
            });
        }
    }
    await themeModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
};
themeService.getAll = async (request) => {
    return await themeModel.aggregate([
        {
            $match: {
                is_deleted: '0',
                status: 'active'
            }
        },
        {
            $project: {
                themeName: 1,
                themeImg: 1,
                themeDiscription: 1,
            }
        }
    ])
};

module.exports = themeService;