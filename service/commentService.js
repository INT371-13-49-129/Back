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