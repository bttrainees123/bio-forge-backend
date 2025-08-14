const helper = require("../../helper/helper");
const imageService=require("../../service/upload/image.service")
const imageValidation = require("../../validation/upload/image.validation")
const statusCodes=require("../../helper/statusCodes")
const responseHelper = require("../../helper/response");
class imageUploadController {
    singleImage = async (request, response) => {
        try {
            if(!request.files || !request.files.tempImage){
                return responseHelper.BadRequest(response, `No image uploaded`, null, statusCodes.OK);
            }
            if (Array.isArray(request.files.tempImage)) {
                return responseHelper.BadRequest(response, `You can't select multiple images`, null, statusCodes.OK);
            }
            const { error } = await imageValidation.validateImage(request.files);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const imageData=await imageService.singleImage(request)
            return responseHelper.success(response, `image Upload Successfully`, imageData, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
    mulitpleImage=async(request,response)=>{
        try {
            if(!request.files || !request.files.tempImage || request.files.tempImage.length==0){
                return responseHelper.BadRequest(response, `No image uploaded`, null, statusCodes.OK);
            }
            let images = Array.isArray(request.files.tempImage) 
            ? request.files.tempImage 
            : [request.files.tempImage];
            const { error } = await imageValidation.validateMultiImage({ tempImage: images });
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const imageData=await imageService.multiImage(request)
            return responseHelper.success(response, `image Upload Successfully`, imageData, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
            
        }
    }
}
module.exports = new imageUploadController()