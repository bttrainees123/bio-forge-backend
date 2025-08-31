const mongoose = require('mongoose');
const addExperienceSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    type: {
        type: String,
        enum: ['experience', 'education'],
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
    skillName: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'skills',
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
        type: String,
        enum: ['business_man', 'freenlancer', 'student', 'job_seeker', 'other'],
    },
    education: {
        AddHighighSchool: {
            type: String,
            enum: ['Delhi Public School',
                'Kendriya Vidyalaya',
                'La Martiniere',
                'DAV Public School',
                'Loreto Convent'],
        },
        AddCollege: {
            type: String,
            enum: ["Harrow English School",
                'Hansraj College',
                'Hindu College',
                'Presidency College',
                'Loyola College'],
        },
        AddUnderGraduate: {
            type: String,
            enum: [
                'University of Delhi',
                'Banaras Hindu University',
                'Jadavpur University',
                'Christ University',
                'Fergusson College'
            ],
        },
        AddPostGraduate: {
            type: String,
            enum: [
                'Jawaharlal Nehru University',
                'Indian Institute of Science',
                'Tata Institute of Social Sciences',
                'Jamia Millia Islamia',
                'Savitribai Phule Pune University'
            ],
        },
        AddDoctoral: {
            type: String,
            enum: [
                'IIT Bombay',
                'IIT Delhi',
                'AIIMS Delhi',
                'Indian Statistical Institute',
                'National Institute of Mental Health and Neurosciences (NIMHANS)'
            ],
        }
    },
    currentCity: {
        type: String,
    },
    hometown: {
        type: String,
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
