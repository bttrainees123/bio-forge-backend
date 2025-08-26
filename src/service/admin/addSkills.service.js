const addSkillModel = require('../../model/addSkill.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const addSkillsService = {}

addSkillsService.add = async (request) => {
   const data = await addSkillModel.create(request.body);
   return data;
};
addSkillsService.update = async (request) => {
   return await addSkillModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.body._id) }, request.body);
}


module.exports = addSkillsService;