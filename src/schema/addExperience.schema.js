const mongoose = require('mongoose');
const addExperienceSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    type: {
        type: String,
        enum: ['education', 'non_education'],
    },

    ////////////// experience fields /////////////
    title: {
        type: String,
    },
    employementType: {
        type: String,
        enum: ['Full-time', 'part-time', 'student', 'freelancer', 'trainee', 'intership', 'self-employee'],
    },
    organization: {
        type: String,
    },
    currentlyWorking: {
        type: Boolean,
        enum: [true, false],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    latLong: {
        type: String
    },
    // latLong: {
    //     type: { type: String, enum: ['Point'], default: 'Point' },
    //     coordinates: { type: [Number], index: '2dsphere' }
    // },
    description: {
        type: String,
    },
    profileHeadline: {
        type: String,
    },
    addSkills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addSkills',
    }],
    media: {
        linkMedia: {
            type: String,
        },
        fileMedia: {
            type: String,
        }
    },

    /////////////  other fields /////////////
   
    bio_data: {
        type: String,
    },
    work: {
         type:String,
        enum: ['business_man', 'freenlancer', 'student', 'job_seeker', 'other'],
    },
    education: {
        AddHighighSchool: {
            type: String,
            enum: ['HighSchoolA', 'HighSchoolB', 'HighSchoolC'],
        },
        AddCollege: {
            type: String,
            enum: ['CollegeX', 'CollegeY', 'CollegeZ'],
        },
    },
    currentCity: {
        type: String,
    },
    hometown: {
        type: String,
    },
    relationship: {
        type:String,
        enum: ['single', 'mingle', 'married',
            'complicated', 'divorced', 'widowed', 'separated'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    is_deleted: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
}, {
    timestamps: true
});

module.exports = addExperienceSchema
