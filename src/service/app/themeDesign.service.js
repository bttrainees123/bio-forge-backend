const templateModel = require('../../model/themeDesign.model');

const templateService = {}

templateService.add = async (request) => {
  try {
    const { name, templateBody } = request.body;
    const existingTemplate = await templateModel.findOne({ name });
    if (existingTemplate) {
      return {
        status: false,
        message: 'Template name already exists',
        data: null
      };
    }

    const template = new templateModel({ name, templateBody });
    await template.save();

    return {
      status: true,
      message: 'Template added successfully',
      data: { name: template.name, templateBody: template.templateBody }
    };
  } catch (error) {
    console.error('Error in addTemplate:', error.message);
    return {
      status: false,
      message: error.message || 'Internal server error',
      data: null
    };
  }
},


  templateService.updateTemplate = async (request) => {
    try {
      const { name, templateBody } = request.body;
      const template = await templateModel.findOneAndUpdate(
        { name },
        { templateBody, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!template) {
        return {
          status: false,
          message: 'Template not found',
          data: null
        };
      }

      return {
        status: true,
        message: 'Template updated successfully',
        data: { name: template.name, templateBody: template.templateBody }
      };
    } catch (error) {
      console.error('Error in updateTemplate:', error.message);
      return {
        status: false,
        message: error.message || 'Internal server error',
        data: null
      };
    }
  },


  templateService.delete = async (request) => {
    try {
      const { name } = request.body;
      const template = await templateModel.findOneAndDelete({ name });

      if (!template) {
        return {
          status: false,
          message: 'Template not found',
          data: null
        };
      }

      return {
        status: true,
        message: 'Template deleted successfully',
        data: null
      };
    } catch (error) {
      console.error('Error in deleteTemplate:', error.message);
      return {
        status: false,
        message: error.message || 'Internal server error',
        data: null
      };
    }
  },

  /**
   * Retrieves all template names
   * @returns {Object} - Response with status, message, and data
   */
  templateService.getAll = async () => {
   
      const templates = await templateModel.aggregate([
        // {
        //   $match:{
        //     is_deleted:'0',
        //     status:'active'
        //   }
        // },
        {
          $project:{
            name:1,
            templateBody:1
          }
        }
      ]);
      return templates

  }


module.exports = templateService;