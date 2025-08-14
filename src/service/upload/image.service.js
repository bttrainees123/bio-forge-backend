const path = require("path");
const { mkdir } = require('node:fs/promises');
const imageService={}
imageService.singleImage=async(request)=>{
    const pImage = request.files.tempImage;
    const uploadDir = path.join(__dirname, "../../../public/tempUploads");
    await mkdir(uploadDir, { recursive: true });
    const now_time = Date.now();
    const tempImageName = now_time + "___" + pImage.name;
    const imagePath = uploadDir + "/" + tempImageName;
    await pImage.mv(imagePath);
    return tempImageName
}
imageService.multiImage=async(request)=>{
    const fileNames = new Array();
    const tempImages = Array.isArray(request.files.tempImage)
        ? request.files.tempImage
        : [request.files.tempImage];

    const uploadDir = path.join(__dirname, "../../../public/tempUploads");
    await mkdir(uploadDir, { recursive: true });
    for(const image of tempImages){
        const now_time = Date.now();
        const tempImageName = now_time + "___" + image.name;
        const imagePath = uploadDir + "/" + tempImageName;
        await image.mv(imagePath);
        fileNames.push(tempImageName);
    }
    return fileNames

}
module.exports=imageService