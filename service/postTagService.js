const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { post_tag,sequelize } = database;

exports.createPostTag= (data) => {
    try {
      return post_tag.create(data);
    } catch (error) {
      throw error;
    }
};
