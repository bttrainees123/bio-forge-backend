const Joi = require("joi");
class childCategoryValidation {
  static add() {
    return Joi.object({
      topic: Joi.array()
        .items(
          Joi.object({
            language: Joi.string().required().messages({
              "string.empty": "Language is required",
            }),
            title: Joi.string().allow('').optional(),
            description: Joi.string().min(3).required().messages({
              "string.empty": "description is required",
              "string.min": "description must be at least 3 characters long",
            }),
          })
        )
        .min(1)
        .required()
        .messages({
          "array.min": "At least one topic is required",
          "any.required": "Topic is required",
        }),
      image: Joi.string().optional(),
      timeOfTheDay: Joi.string()
        .optional()
        .valid("morning", "evening", "afternoon")
        .messages({
          "any.only": "timeOfTheDay must be either 'morning', 'evening', or 'afternoon'",
        }),
        contentType: Joi.string()
        .valid('daily', 'weekly', 'static')
        .optional()
        .messages({
          "string.base": "contentType must be a string",
          "any.only": "Invalid contentType value"
        }),

      subCategoryId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
          "string.empty": "subCategoryId is required",
          "string.pattern.base":
            "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
        }),
    });
  }

  static update() {
    return Joi.object({
      _id: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
          "string.empty": "_id is required",
          "string.pattern.base":
            "Invalid _id format. Must be a valid MongoDB ObjectId",
        }),
      topic: Joi.array()
        .items(
          Joi.object({
            language: Joi.string().required().messages({
              "string.empty": "Language is required",
            }),
            title: Joi.string().allow('').optional(), 
            description: Joi.string().min(3).required().messages({
              "string.empty": "description is required",
              "string.min": "description must be at least 3 characters long",
            }),
          })
        )
        .min(1)
        .required()
        .messages({
          "array.min": "At least one topic is required",
          "any.required": "Topic is required",
        }),
      image: Joi.string().optional(),
      timeOfTheDay: Joi.string()
        .optional()
        .valid("morning", "evening", "afternoon")
        .messages({
          "any.only": "timeOfTheDay must be either 'morning', 'evening', or 'afternoon'",
        }),
        contentType: Joi.string()
        .valid('daily', 'weekly', 'static')
        .optional()
        .messages({
          "string.base": "contentType must be a string",
          "any.only": "Invalid contentType value"
        }),
      subCategoryId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
          "string.empty": "subCategoryId is required",
          "string.pattern.base":
            "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
        }),

      status: Joi.string()
        .valid("active", "inactive") // Only allows these two values
        .required()
        .messages({
          "any.only": "Status must be either 'active' or 'inactive'",
          "string.empty": "Status is required",
        }),
    });
  }
  static validateAdd(data) {
    return childCategoryValidation
      .add()
      .validate(data, { abortEarly: false });
  }
  static validateUpdate(data) {
    return childCategoryValidation
      .update()
      .validate(data, { abortEarly: false });
  }
}

module.exports = childCategoryValidation;
