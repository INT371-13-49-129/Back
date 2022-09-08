const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { post_tag, sequelize } = database;

exports.createPostTag = (data) => {
  try {
    return post_tag.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updatePostTag = (post_tag_id, payload) => {
  try {
    return post_tag.update(payload, {
      where: {
        post_tag_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};
