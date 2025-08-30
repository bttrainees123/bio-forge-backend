const Joi = require("joi");

class experienceValidation {
    
    /**
     * Validation schema for education type experience
     */
    static educationExperience() {
        return Joi.object({
            type: Joi.string()
                .valid('education')
                .required()
                .messages({
                    "any.required": "Type is required",
                    "any.only": "Type must be 'education'"
                }),
            
            title: Joi.string()
                .min(2)
                .max(100)
                .required()
                .messages({
                    "string.empty": "Title is required",
                    "string.min": "Title must be at least 2 characters long",
                    "string.max": "Title must not exceed 100 characters"
                }),
            
            employementType: Joi.string()
                .valid('Full-time', 'part-time', 'student', 'freelancer', 'trainee', 'intership', 'self-employee')
                .messages({
                    "any.only": "Invalid employment type"
                }),
            
            organization: Joi.string()
                .min(2)
                .max(100)
                .required()
                .messages({
                    "string.empty": "Organization is required",
                    "string.min": "Organization must be at least 2 characters long",
                    "string.max": "Organization must not exceed 100 characters"
                }),
            
            currentlyWorking: Joi.boolean()
                .messages({
                    "boolean.base": "Currently working must be true or false"
                }),
            
            startDate: Joi.date()
                .iso()
                .messages({
                    "date.base": "Start date must be a valid date",
                    "date.format": "Start date must be in ISO format"
                }),
            
            endDate: Joi.date()
                .iso()
                .when('currentlyWorking', {
                    is: false,
                    then: Joi.date().min(Joi.ref('startDate')),
                    otherwise: Joi.forbidden()
                })
                .messages({
                    "date.base": "End date must be a valid date",
                    "date.format": "End date must be in ISO format",
                    "date.min": "End date must be after start date",
                    "any.unknown": "End date is not allowed when currently working"
                }),
            
            latLong: Joi.string()
                // .pattern(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
                .messages({
                    "string.pattern.base": "Latitude and longitude must be in format 'lat,lng'"
                }),
            
            description: Joi.string()
                .max(1000)
                .messages({
                    "string.max": "Description must not exceed 1000 characters"
                }),
            
            profileHeadline: Joi.string()
                .max(200)
                .messages({
                    "string.max": "Profile headline must not exceed 200 characters"
                }),
            
            addSkills: Joi.array()
                .items(
                    Joi.string().pattern(/^[a-fA-F0-9]{24}$/)
                    .messages({
                        "string.pattern.base": "Invalid skill ID format. Must be a valid MongoDB ObjectId"
                    })
                )
                .messages({
                    "array.base": "Skills must be an array"
                }),
            
            media: Joi.object({
                linkMedia: Joi.string().uri().messages({
                    "string.uri": "Link media must be a valid URL"
                }),
                fileMedia: Joi.string().messages({
                    "string.base": "File media must be a string"
                })
            }).messages({
                "object.base": "Media must be an object"
            })
        });
    }

    /**
     * Validation schema for non-education type experience
     */
    static nonEducationExperience() {
        return Joi.object({
            type: Joi.string()
                .valid('non_education')
                .required()
                .messages({
                    "any.required": "Type is required",
                    "any.only": "Type must be 'non_education'"
                }),
            
            bio_data: Joi.string()
                .max(1000)
                .messages({
                    "string.max": "Bio data must not exceed 1000 characters"
                }),
            
            work: Joi.string()
                .valid('business_man', 'freenlancer', 'student', 'job_seeker', 'other')
                .messages({
                    "any.only": "Invalid work type"
                }),
            
            education: Joi.object({
                AddHighighSchool: Joi.string()
                    .valid('HighSchoolA', 'HighSchoolB', 'HighSchoolC')
                    .messages({
                        "any.only": "Invalid high school selection"
                    }),
                AddCollege: Joi.string()
                    .valid('CollegeX', 'CollegeY', 'CollegeZ')
                    .messages({
                        "any.only": "Invalid college selection"
                    })
            }).messages({
                "object.base": "Education must be an object"
            }),
            
            currentCity: Joi.string()
                .max(100)
                .messages({
                    "string.max": "Current city must not exceed 100 characters"
                }),
            
            hometown: Joi.string()
                .max(100)
                .messages({
                    "string.max": "Hometown must not exceed 100 characters"
                }),
            
            relationship: Joi.string()
                .valid('single', 'mingle', 'married', 'complicated', 'divorced', 'widowed', 'separated')
                .messages({
                    "any.only": "Invalid relationship status"
                })
        }).or('bio_data', 'work', 'education', 'currentCity', 'hometown', 'relationship')
        .messages({
            "object.missing": "At least one field is required: bio_data, work, education, currentCity, hometown, or relationship"
        });
    }

    /**
     * Validation schema for update operations
     */
    static updateExperience() {
        return Joi.object({
            _id: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "Experience ID is required",
                    "string.pattern.base": "Invalid Experience ID format. Must be a valid MongoDB ObjectId"
                }),
            
            // Allow both education and non-education fields, validation will be done in service based on existing type
            title: Joi.string().min(2).max(100),
            employementType: Joi.string().valid('Full-time', 'part-time', 'student', 'freelancer', 'trainee', 'intership', 'self-employee'),
            organization: Joi.string().min(2).max(100),
            currentlyWorking: Joi.boolean(),
            startDate: Joi.date().iso(),
            endDate: Joi.date().iso(),
            latLong: Joi.string()
            // .pattern(/^-?\d+\.?\d*,-?\d+\.?\d*$/)
            ,
            description: Joi.string().max(1000),
            profileHeadline: Joi.string().max(200),
            addSkills: Joi.array().items(Joi.string().pattern(/^[a-fA-F0-9]{24}$/)),
            media: Joi.object({
                linkMedia: Joi.string().uri(),
                fileMedia: Joi.string()
            }),
            bio_data: Joi.string().max(1000),
            work: Joi.string().valid('business_man', 'freenlancer', 'student', 'job_seeker', 'other'),
            education: Joi.object({
                AddHighighSchool: Joi.string().valid('HighSchoolA', 'HighSchoolB', 'HighSchoolC'),
                AddCollege: Joi.string().valid('CollegeX', 'CollegeY', 'CollegeZ')
            }),
            currentCity: Joi.string().max(100),
            hometown: Joi.string().max(100),
            relationship: Joi.string().valid('single', 'mingle', 'married', 'complicated', 'divorced', 'widowed', 'separated')
        });
    }

    /**
     * Validation schema for delete operations
     */
    // static deleteExperience() {
    //     return Joi.object({
    //         _id: Joi.string()
    //             .pattern(/^[a-fA-F0-9]{24}$/)
    //             .required()
    //             .messages({
    //                 "string.empty": "Experience ID is required",
    //                 "string.pattern.base": "Invalid Experience ID format. Must be a valid MongoDB ObjectId"
    //             })
    //     });
    // }

    /**
     * Validate add education experience data
     */
    static validateAddEducation(data) {
        return experienceValidation.educationExperience().validate(data, { abortEarly: false });
    }

    /**
     * Validate add non-education experience data
     */
    static validateAddNonEducation(data) {
        return experienceValidation.nonEducationExperience().validate(data, { abortEarly: false });
    }

    /**
     * Validate update experience data
     */
    static validateUpdate(data) {
        return experienceValidation.updateExperience().validate(data, { abortEarly: false });
    }

    /**
     * Validate delete experience data
     */
    // static validateDelete(data) {
    //     return experienceValidation.deleteExperience().validate(data, { abortEarly: false });
    // }

    /**
     * Dynamic validation based on type
     */
    static validateByType(data) {
        if (data.type === 'education') {
            return this.validateAddEducation(data);
        } else if (data.type === 'non_education') {
            return this.validateAddNonEducation(data);
        } else {
            return {
                error: {
                    details: [{ message: 'Type must be either "education" or "non_education"' }]
                }
            };
        }
    }
}

module.exports = experienceValidation;