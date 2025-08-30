const addSkillService = require('../../service/admin/addSkills.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const addSkillModel = require('../../model/addSkill.model');

class addSkillController {
    add = async (request, response) => {
        try {
            // const { error } = await addExperienceValidation.validateAddaddExperience(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            await addSkillService.add(request);
            return responseHelper.success(response, `Skill added successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    update = async (request, response) => {
        try {
            // const { error } = await addExperienceValidation.validateUpdateaddExperience(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            await addSkillService.update(request);
            return responseHelper.success(response, `Skill  updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const addExperienceData = await addSkillModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id), is_deleted: '0' });
            if (!addExperienceData) {
                return responseHelper.Forbidden(response, `addExperience not found`, null, statusCodes.OK)
            }
            await addSkillService.delete(request);
            return responseHelper.success(response, `addExperience deleted successfully`, null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await addSkillService.getAll(request);
            return responseHelper.success(response, `addExperience fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    status = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const addExperienceInfo = await addSkillModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!addExperienceInfo) {
                return responseHelper.Forbidden(response, "addExperience not exists", null, statusCodes.OK);
            } else if (addExperienceInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "addExperience account is deleted", null, statusCodes.OK);
            }
            await addSkillService.status(request)
            return responseHelper.success(response, `addExperience status update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
}

module.exports = new addSkillController()