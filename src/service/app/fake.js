bioDataService.getAll = async (request) => {
    // Extract username from query parameters
    const username = request?.query?.username;

    // Validate username
    if (!username) {
        throw new Error('Username is required in query parameters');
    }

    return await bioDataModel.aggregate([
        // Step 1: Lookup user information based on username
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            username: username, // Match the username as a string
                            is_deleted: '0'
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            email: 1
                        }
                    }
                ],
                as: 'userInfo'
            }
        },
        // Step 2: Filter bioData documents where userInfo is not empty
        {
            $match: {
                'userInfo': { $ne: [] }, // Ensure user was found
                is_deleted: '0',
                status: 'active'
            }
        },
        // Step 3: Lookup experience information
        {
            $lookup: {
                from: 'educationalinformations',
                localField: 'userId',
                foreignField: 'userId',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0',
                            status: 'active',
                            type: 'experience'
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            employementType: 1,
                            organization: 1,
                            currentlyWorking: 1,
                            startDate: 1,
                            type: 1,
                            endDate: 1,
                            latLong: 1,
                            description: 1,
                            profileHeadline: 1,
                            media: 1,
                            bio_data: 1,
                            work: 1,
                            currentCity: 1,
                            hometown: 1,
                            relationship: 1,
                            education: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            state:1
                        }
                    }
                ],
                as: 'educationExperience'
            }
        },
        // Step 4: Lookup education information
        {
            $lookup: {
                from: 'educationalinformations',
                localField: 'userId',
                foreignField: 'userId',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0',
                            status: 'active',
                            type: 'education'
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            employementType: 1,
                            organization: 1,
                            currentlyWorking: 1,
                            startDate: 1,
                            type: 1,
                            endDate: 1,
                            latLong: 1,
                            description: 1,
                            profileHeadline: 1,
                            media: 1,
                            bio_data: 1,
                            work: 1,
                            currentCity: 1,
                            hometown: 1,
                            relationship: 1,
                            education: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            state:1
                        }
                    }
                ],
                as: 'nonEducationExperience'
            }
        },
        // Step 5: Lookup skills
        {
            $lookup: {
                from: 'skills',
                localField: 'skills',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            skillName: 1
                        }
                    }
                ],
                as: 'skills'
            }
        },
        // Step 6: Project the desired fields
        {
            $project: {
                username: { $arrayElemAt: ['$userInfo.username', 0] },
                email: { $arrayElemAt: ['$userInfo.email', 0] },
                profileImage: 1,
                backgroundImage: 1,
                bio: 1,
                skills: 1,
                relationship: 1,
                interests: 1,
                experienceInfo: {
                    experience: '$educationExperience',
                    education: '$nonEducationExperience'
                }
            }
        },
        // Step 7: Sort by updatedAt in descending order
        {
            $sort: {
                updatedAt: -1
            }
        }
    ]);
};