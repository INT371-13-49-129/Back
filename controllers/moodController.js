const moodService = require("../service/moodService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createMood = async (req, res) => {
    const { name, mood_level, icon, color } = req.body;
    try {
      const mood = await moodService.createMood({ name, mood_level, icon, color });
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

exports.getAllMood = async (req, res) => {
    try {
      const moods = await moodService.getAllMood();
      res.status(200).send({
        status: "success",
        moods
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
