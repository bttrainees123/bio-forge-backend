const { default: mongoose } = require("mongoose");
const helper = require("../../helper/helper");
const userModel = require("../../model/user.model");
const templateModel = require("../../model/theme.model");
const themeModel = require("../../model/theme.model");
const userService = {}

userService.add = async (request) => {
    const hashpassword = await helper.createPassword(request.body.password)
    request.body.password = hashpassword
    const data = await userModel.create(request.body)
    return data
}
userService.update = async (request) => {
    if (request?.body?.password) {
        const hashpassword = await helper.createPassword(request.body.password)
        request.body.password = hashpassword
    }
    await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.body?._id) }, request?.body)
}
userService.get = async (request) => {
    const search = request?.query?.search || "";
    const page = Number(request?.query?.page) || 1;
    const limit = Number(request?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await userModel.aggregate([
        {
            $match: {
                is_deleted: "0",
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                username: 1,
                profile_img:1,
                email: 1,
                status: 1,
                reportStatus: 1,
                bio:1,
                banner_img:1
            }
        },
        helper.applyPagination(skip, limit),
    ])
    const response = {
        getData: data ? data[0].paginatedResults : {},
        count: data[0].totalCount[0] ? data[0].totalCount[0].total : 0
    };
    return response
}
userService.delete = async (request) => {
    await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { is_deleted: "1" })
}
userService.status = async (request) => {
    const userInfo = await userModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (userInfo.status === 'active') {
        await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}
userService.themeStatus = async (request) => {
    const userInfo = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (userInfo.status === 'active') {
        await themeModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await themeModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}
userService.templateStatus = async (request) => {
    const templateInfo = await templateModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (templateInfo.status === 'active') {
        await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await templateModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}

userService.dashboard = async (request) => {
    const [userStats, themeCount] = await Promise.all([
        userModel.aggregate([
            {
                $match: { is_deleted: "0" }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    activeUsers: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "active"] }, 1, 0]
                        }
                    },
                    inactiveUsers: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "inactive"] }, 1, 0]
                        }
                    }
                }
            }
        ]),
        templateModel.countDocuments({ is_deleted: "0" })
    ]);

    const stats = userStats[0] || { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 };

    return {
        totalUsers: stats.totalUsers,
        activeUsers: stats.activeUsers,
        inactiveUsers: stats.inactiveUsers,
        totalThemes: themeCount
    };
};

userService.getAll = async (request) => {
    const search = request?.query?.search || "";
    const page = Number(request?.query?.page) || 1;
    const limit = Number(request?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await themeModel.aggregate([
        {
            $match: {
                is_deleted: '0',
               $or: [
                    { themeName: { $regex: search, $options: "i" } },
                ]
            }
        },
        {
            $project: {
                themeName: 1,
                themeImg: 1,
                themeDiscription: 1,
                status:1
            }
        },
     helper.applyPagination(skip, limit),
    ])
    const response = {
        getData: data ? data[0].paginatedResults : {},
        count: data[0].totalCount[0] ? data[0].totalCount[0].total : 0
    };
    return response
};

module.exports = userService
module.exports = userService