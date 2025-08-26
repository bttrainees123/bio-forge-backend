const addExperienceModel = require('../../model/addExperience.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const path = require('path');
const addExperienceService = {}

addExperienceService.add = async (request) => {
    const { body } = request;
    const type = body.type;

    body.userId = request.auth._id;

    if (!type || !['education', 'non_education'].includes(type)) {
        throw new Error('Type is required and must be either "education" or "non_education"');
    }

    if (body.media?.fileMedia) {
        await helper.moveFileFromFolder(body.media.fileMedia, "mediaType");
    }

    if (type === 'education') {
        delete body.bio_data;
        delete body.work;
        delete body.education;
        delete body.currentCity;
        delete body.hometown;
        delete body.relationship;

        if (body.startDate && body.endDate && !body.currentlyWorking) {
            if (new Date(body.startDate) > new Date(body.endDate)) {
                throw new Error('Start date cannot be after end date');
            }
        }

        if (body.currentlyWorking) {
            delete body.endDate;
        }

    } else if (type === 'non_education') {
        delete body.title;
        delete body.employementType;
        delete body.organization;
        delete body.currentlyWorking;
        delete body.startDate;
        delete body.endDate;
        delete body.latLong;
        delete body.description;
        delete body.profileHeadline;
        delete body.addSkills;
        delete body.media;

        const existingRecord = await addExperienceModel.findOne({
            userId: new mongoose.Types.ObjectId(body.userId),
            type: 'non_education',
            is_deleted: '0'
        });

        if (existingRecord) {
            return await addExperienceModel.findByIdAndUpdate(
                existingRecord._id,
                { $set: body },
                { new: true, runValidators: true }
            );
        }
    }

    const data = await addExperienceModel.create(body);
    return data;
};


addExperienceService.update = async (request) => {
    const { body } = request;
    const experienceId = body._id;

    if (!experienceId) {
        throw new Error('Experience ID is required');
    }

    const experienceData = await addExperienceModel.findOne({ 
        _id: new mongoose.Types.ObjectId(experienceId),
        is_deleted: '0'
    });

    if (!experienceData) {
        throw new Error('Experience record not found');
    }

    const oldImage = experienceData.media?.fileMedia || "";
    const newImage = body.media?.fileMedia || "";
    const tempUploadPath = path.join("public", "tempUploads", newImage);

    if (newImage && fs.existsSync(tempUploadPath)) {
        await helper.moveFileFromFolder(newImage, "mediaType");
        
        if (oldImage && oldImage !== newImage) {
            const oldImagePath = path.join("public", "mediaType", oldImage);
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
        body.media.fileMedia = newImage;
    }

    if (experienceData.type === 'education') {
        delete body.bio_data;
        delete body.work;
        delete body.education;
        delete body.currentCity;
        delete body.hometown;
        delete body.relationship;

        if (body.startDate && body.endDate && !body.currentlyWorking) {
            if (new Date(body.startDate) > new Date(body.endDate)) {
                throw new Error('Start date cannot be after end date');
            }
        }

        if (body.currentlyWorking) {
            delete body.endDate;
        }

    } else if (experienceData.type === 'non_education') {
        delete body.title;
        delete body.employementType;
        delete body.organization;
        delete body.currentlyWorking;
        delete body.startDate;
        delete body.endDate;
        delete body.latLong;
        delete body.description;
        delete body.profileHeadline;
        delete body.addSkills;
    }

    delete body.userId;
    delete body.type;
    delete body._id;

    return await addExperienceModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(experienceId) }, 
        body,
        { new: true, runValidators: true }
    );
};

addExperienceService.delete = async (request) => {
    const experienceId = request?.query?._id;

    if (!experienceId) {
        throw new Error('Experience ID is required');
    }

    const experience = await addExperienceModel.findOne({ 
        _id: new mongoose.Types.ObjectId(experienceId),
        is_deleted: '0'
    });

    if (!experience) {
        throw new Error('Experience record not found');
    }

    if (experience.media?.fileMedia) {
        const mediaPath = path.join("public", "mediaType", experience.media.fileMedia);
        if (fs.existsSync(mediaPath)) {
            fs.unlink(mediaPath, (err) => {
                if (err) {
                    console.error(`Failed to delete media: ${err.message}`);
                } else {
                    console.log(`Deleted media: ${experience.media.fileMedia}`);
                }
            });
        }
    }

    await addExperienceModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(experienceId) },
        { is_deleted: '1' }
    );

    return { message: 'Experience deleted successfully' };
};
addExperienceService.updateStatus = async (request) => {
    const linkUpdate = await addExperienceModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
    if (linkUpdate.status === 'active') {
        await addExperienceModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    }
    else {
        await addExperienceModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: 'active' })
    }
}
addExperienceService.getAll = async (request) => {
    const userId = request?.auth?._id || request?.query?.userId;
    const type = request?.query?.type;

    // Validate required parameters
    if (!userId) {
        throw new Error('UserId is required');
    }

    if (!type || !['education', 'non_education'].includes(type)) {
        throw new Error('Type is required and must be either "education" or "non_education"');
    }

    const matchCondition = {
        userId: new mongoose.Types.ObjectId(userId),
        type: type,
        is_deleted: '0',
        status: 'active'
    };

    if (type === 'education') {
        return await addExperienceModel.aggregate([
            {
                $match: matchCondition
            },
            {
                $lookup: {
                    from: 'addskills',
                    localField: 'addSkills',
                    foreignField: '_id',
                    as: 'skillsInfo'
                }
            },
            {
                $project: {
                    title: 1,
                    employementType: 1,
                    organization: 1,
                    currentlyWorking: 1,
                    startDate: 1,
                    type:1,
                    endDate: 1,
                    latLong: 1,
                    description: 1,
                    profileHeadline: 1,
                    addSkills: '$skillsInfo',
                    media: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]);

    } else if (type === 'non_education') {
        return await addExperienceModel.aggregate([
            {
                $match: matchCondition
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                is_deleted: '0'
                            }
                        },
                        {
                            $project: {
                                username: 1
                            }
                        }
                    ],
                    as: 'userInfo'
                }
            },
            {
                $project: {
                    username: { $arrayElemAt: ['$userInfo.username', 0] },
                    bio_data: 1,
                    work: 1,
                    education: 1,
                    currentCity: 1,
                    hometown: 1,
                    relationship: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]);
    }
};


 if (experience.media?.fileMedia) {
        const mediaPath = path.join("public", "mediaType", experience.media.fileMedia);
        if (fs.existsSync(mediaPath)) {
            fs.unlink(mediaPath, (err) => {
                if (err) {
                    console.error(`Failed to delete media: ${err.message}`);
                } else {
                    console.log(`Deleted media: ${experience.media.fileMedia}`);
                }
            });
        }
    }
module.exports = addExperienceService;