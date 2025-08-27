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
addSkillsService.getAll = async ()=>{
   const data =  await addSkillModel.aggregate([
      {
         $match:{
            is_deleted:'0',
            status:'active'
         }
      },
      {
         $project:{
            addSkills:1
         }
      }
      
   ]);
   return data
}


module.exports = addSkillsService;