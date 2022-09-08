const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { comment,sequelize } = database;

exports.createComment= (data) => {
    try {
      return comment.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getCommentByCommentId = (comment_id) => {
  try {
    return comment.findOne({
      where: {
        comment_id,
        is_delete: false,
      },
      attributes: [
        "comment_id",
        "text",
        "post_id",
        "account_id",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.updateComment = (comment_id, payload) => {
  try {
    return comment.update(payload, {
      where: {
        comment_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};