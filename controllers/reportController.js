const reportService = require("../service/reportService.js");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createReport = async (req, res) => {
  const account_id_reporter = req.jwt.account_id;
  const {
    message,
    account_id = null,
    post_id = null,
    comment_id = null,
  } = req.body;
  try {
    const report = await reportService.createReport({
      message,
      account_id_reporter,
      account_id,
      post_id,
      comment_id,
    });
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

exports.getAllReport = async (req, res) => {
  try {
    const reports = await reportService.getAllReport();
    res.status(200).send({
      status: "success",
      reports,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
}