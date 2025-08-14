const cron = require('node-cron');
const reportModel = require('../../model/report.model');
const userModel = require('../../model/user.model');
const mongoose = require('mongoose');

class UserReportCronService {
    
    static async checkAndInactiveReportedUsers() {
        try {
            console.log(' Starting cron job: Checking users with multiple reports...');
            
            const usersWithMultipleReports = await reportModel.aggregate([
                {
                    $match: {
                        reportedUserId: { $exists: true, $ne: null },
                        is_deleted: { $ne: '1' } 
                    }
                },
                {
                    $group: {
                        _id: "$reportedUserId",
                        reportCount: { $sum: 1 },
                        reports: {
                            $push: {
                                reportedBy: "$reportedByUserId",
                                message: "$message",
                                createdAt: "$createdAt"
                            }
                        },
                        latestReport: { $max: "$createdAt" }
                    }
                },
                {
                    $match: {
                        reportCount: { $gte: 2 } 
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userInfo',
                        pipeline: [
                            {
                                $match: {
                                    is_deleted: '0',
                                    status: 'active',
                                    reportStatus: { $ne: 'true' } 
                                }
                            },
                            {
                                $project: {
                                    username: 1,
                                    email: 1,
                                    status: 1,
                                    reportStatus: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $match: {
                        userInfo: { $ne: [] } 
                    }
                },
                {
                    $project: {
                        reportedUserId: "$_id",
                        reportCount: 1,
                        reports: 1,
                        latestReport: 1,
                        userInfo: { $arrayElemAt: ['$userInfo', 0] }
                    }
                }
            ]);

            console.log(` Found ${usersWithMultipleReports.length} users with 2+ reports`);

            if (usersWithMultipleReports.length === 0) {
                console.log(' No users found with multiple reports');
                return {
                    success: true,
                    message: 'No users found with multiple reports',
                    processedUsers: 0
                };
            }

            let processedUsers = 0;
            let errors = [];

            for (const reportData of usersWithMultipleReports) {
                try {
                    const userId = reportData.reportedUserId;
                    const reportCount = reportData.reportCount;
                    const userInfo = reportData.userInfo;

                    console.log(` Processing user: ${userInfo.username} (${userInfo.email}) - Reports: ${reportCount}`);

                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        {
                            reportStatus: 'true',
                            status: 'inactive', 
                            inactiveReason: `Automatically inactivated due to ${reportCount} reports`,
                            inactivatedAt: new Date(),
                            reportCount: reportCount
                        },
                        { new: true }
                    );

                    if (updatedUser) {
                        console.log(` User ${userInfo.username} has been inactivated (${reportCount} reports)`);
                        processedUsers++;
                        
                        await this.logUserInactivation(userId, reportCount, reportData.reports);
                    } else {
                        console.log(` Failed to inactivate user ${userInfo.username}`);
                        errors.push(`Failed to inactivate user ${userInfo.username}`);
                    }

                } catch (userError) {
                    console.error(` Error processing user ${reportData.userInfo?.username}:`, userError);
                    errors.push(`Error processing user ${reportData.userInfo?.username}: ${userError.message}`);
                }
            }

            const result = {
                success: true,
                message: `Processed ${processedUsers} users successfully`,
                processedUsers,
                totalFound: usersWithMultipleReports.length,
                errors: errors.length > 0 ? errors : null
            };

            console.log(' Cron job completed:', result);
            return result;

        } catch (error) {
            console.error(' Error in checkAndInactiveReportedUsers cron job:', error);
            return {
                success: false,
                message: 'Cron job failed',
                error: error.message
            };
        }
    }

    static async logUserInactivation(userId, reportCount, reportDetails) {
        try {
            console.log(` AUDIT LOG: User ${userId} inactivated due to ${reportCount} reports`);
            console.log(` Report details:`, reportDetails.map(r => ({
                reportedBy: r.reportedBy,
                message: r.message?.substring(0, 50) + '...', 
                reportedAt: r.createdAt
            })));
            
            // You could also save this to an audit log collection if needed
            // await auditLogModel.create({
            //     action: 'USER_AUTO_INACTIVATED',
            //     userId: userId,
            //     reason: `${reportCount} reports received`,
            //     details: reportDetails,
            //     timestamp: new Date()
            // });

        } catch (error) {
            console.error(' Error logging user inactivation:', error);
        }
    }

    static async getReportStatistics() {
        try {
            const stats = await reportModel.aggregate([
                {
                    $match: {
                        reportedUserId: { $exists: true, $ne: null },
                        is_deleted: { $ne: '1' }
                    }
                },
                {
                    $group: {
                        _id: "$reportedUserId",
                        reportCount: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUniqueReportedUsers: { $sum: 1 },
                        totalReports: { $sum: "$reportCount" },
                        usersWithOneReport: {
                            $sum: { $cond: [{ $eq: ["$reportCount", 1] }, 1, 0] }
                        },
                        usersWithTwoReports: {
                            $sum: { $cond: [{ $eq: ["$reportCount", 2] }, 1, 0] }
                        },
                        usersWithThreeOrMoreReports: {
                            $sum: { $cond: [{ $gte: ["$reportCount", 3] }, 1, 0] }
                        },
                        maxReportsForSingleUser: { $max: "$reportCount" },
                        avgReportsPerUser: { $avg: "$reportCount" }
                    }
                }
            ]);

            return stats[0] || {
                totalUniqueReportedUsers: 0,
                totalReports: 0,
                usersWithOneReport: 0,
                usersWithTwoReports: 0,
                usersWithThreeOrMoreReports: 0,
                maxReportsForSingleUser: 0,
                avgReportsPerUser: 0
            };

        } catch (error) {
            console.error(' Error getting report statistics:', error);
            return {};
        }
    }

    static startCronJob() {
        console.log(' Starting User Report Cron Job...');
        
        const task = cron.schedule('* * * * *', async () => {
            const now = new Date();
            console.log(` Running scheduled user report check at: ${now.toISOString()}`);
            console.log(` Local time: ${now.toLocaleString()}`);
            
            await this.checkAndInactiveReportedUsers();
            
            console.log(` Cron job cycle completed at: ${new Date().toISOString()}`);
            console.log(' Next run in 10 minutes...\n');
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });

        console.log(' User Report Cron Job scheduled successfully');
        console.log(' Schedule: Every 1 minutes (* * * * *)');
        console.log(' Timezone: Asia/Kolkata');
        console.log(' Status: ACTIVE');
        console.log('⏭ Next run: In 10 minutes\n');
        
        return task;
    }

    static async manualTrigger() {
        console.log(' Manual trigger initiated...');
        console.log(` Triggered at: ${new Date().toISOString()}`);
        
        const result = await this.checkAndInactiveReportedUsers();
        
        const stats = await this.getReportStatistics();
        console.log(' Current Report Statistics:', stats);
        
        return { ...result, statistics: stats };
    }

    static stopCronJob(task) {
        if (task) {
            task.stop();
            console.log(' User Report Cron Job stopped');
        }
    }

    static getCronJobInfo() {
        return {
            name: 'User Report Auto-Inactivation',
            schedule: 'Every 1 minutes (* * * * *)',
            description: 'Automatically inactivates users with 2+ reports',
            timezone: 'Asia/Kolkata',
            status: 'ACTIVE',
            frequency: 'Every 1 minutes'
        };
    }

    static async reactivateUser(userId, reason = 'Manual reactivation') {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    reportStatus: 'false',
                    status: 'active',
                    inactiveReason: null,
                    reactivatedAt: new Date(),
                    reactivationReason: reason
                },
                { new: true }
            );

            if (updatedUser) {
                console.log(` User ${updatedUser.username} has been reactivated`);
                return { success: true, message: 'User reactivated successfully', user: updatedUser };
            } else {
                return { success: false, message: 'User not found' };
            }

        } catch (error) {
            console.error(' Error reactivating user:', error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = UserReportCronService;
