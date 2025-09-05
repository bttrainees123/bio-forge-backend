const addSkillModel = require('../../model/addSkill.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const skillNameService = {}

skillNameService.add = async (request) => {
   const data = await addSkillModel.create(request.body);
   return data;
};
skillNameService.update = async (request) => {
   return await addSkillModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.body._id) }, request.body);
}
skillNameService.getAll = async (request)=>{
     const search = request?.query?.search || '';
        const matchStage = {
            is_deleted: '0', 
            status: 'active' 
        };
        if (search) {
            matchStage.skillName = { $regex: search, $options: 'i' }; 
        }
        const data = await addSkillModel.aggregate([
            {
                $match: matchStage
            },
            {
                $project: {
                    skillName: 1,
                    _id: 1,  
                }
            }
        ]);
        return data;
}


module.exports = skillNameService;