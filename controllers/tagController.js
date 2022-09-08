const tagService = require("../service/tagService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createTag = async (req, res) => {
    const { name, tag_type } = req.body;
    try {
      const tag = await tagService.createTag({ name, tag_type });
      res.status(200).send({
        status: "success",
      });
    } catch (error) {
      console.log(error);
      errorResponse(res, {
        statusResponse: 500,
        statusCode: statusCode(1001),
        errorMessage: error,
      });
    }
};

exports.getAllTag = async (req, res) => {
    try {
      const tags = await tagService.getAllTag();
      res.status(200).send({
        status: "success",
        tags
      });
    } catch (error) {
      console.log(error);
      errorResponse(res, {
        statusResponse: 500,
        statusCode: statusCode(1001),
        errorMessage: error,
      });
    }
};
