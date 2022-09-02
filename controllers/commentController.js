const commentService = require("../service/commentService");
const logEditService = require("../service/logEditService");
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

exports.updateComment = async (req, res) => {
  const { account_id } = req.jwt;
  const { comment_id, text } = req.body;
  try {
    const comment = await commentService.getCommentByCommentId(comment_id);
    if (!comment)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(4001),
        errorMessage: `Comment Id(${comment_id}) Does not exist`,
      });
    if (comment.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to edit Comment Id(${comment_id})`,
      });
    await commentService.updateComment(comment_id, { text });
    const log_data = {
      text: comment.text
    }
    await logEditService.createLogEdit({ comment_id , log_data });
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

exports.deleteComment = async (req,res)=>{
  const { account_id } = req.jwt
  const { comment_id } = req.params
  try {
    const comment = await commentService.getCommentByCommentId(comment_id);
    if (!comment)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(4001),
        errorMessage: `Comment Id(${comment_id}) Does not exist`,
      });
    if (comment.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to delete Comment Id(${comment_id})`,
      });
    await commentService.updateComment(comment_id, { is_delete:true });
    return res.status(200).send({ status: "success" })
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  } 
}