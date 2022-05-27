const commentService = require("../service/commentService");

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
      res.status(400).send({
        status: "error",
        error: error,
      });
    }
};