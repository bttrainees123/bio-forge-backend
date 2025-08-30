const path = require("path");
const { mkdir } = require("node:fs/promises");

const imageService = {};

// Use project root instead of __dirname
const ROOT_DIR = path.resolve(); // or process.cwd()

imageService.singleImage = async (request) => {
  const pImage = request.files.tempImage;
  const uploadDir = path.join(ROOT_DIR, "public", "tempUploads");

  await mkdir(uploadDir, { recursive: true });

  const now_time = Date.now();
  const tempImageName = now_time + "___" + pImage.name;
  const imagePath = path.join(uploadDir, tempImageName);

  await pImage.mv(imagePath);

  return tempImageName;
};

imageService.multiImage = async (request) => {
  const fileNames = [];
  const tempImages = Array.isArray(request.files.tempImage)
    ? request.files.tempImage
    : [request.files.tempImage];

  const uploadDir = path.join(ROOT_DIR, "public", "tempUploads");
  await mkdir(uploadDir, { recursive: true });

  for (const image of tempImages) {
    const now_time = Date.now();
    const tempImageName = now_time + "___" + image.name;
    const imagePath = path.join(uploadDir, tempImageName);

    await image.mv(imagePath);
    fileNames.push(tempImageName);
  }

  return fileNames;
};

module.exports = imageService;
