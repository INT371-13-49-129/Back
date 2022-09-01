const commentService = require("../service/commentService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createComment = async (req, res) => {
    const { account_id } = req.jwt
    const { text, post_id, reply_comment_id } = req.body;
    try {
      await commentService.createComment({ text, post_id, reply_comment_id, account_id });
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