const topicService = require("../service/topicService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createTopic = async (req, res) => {
    const { name } = req.body;
    try {
      const tag = await topicService.createTopic({ name });
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

exports.getAllTopic = async (req, res) => {
    try {
      const topics = await topicService.getAllTopic();
      res.status(200).send({
        status: "success",
        topics
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
