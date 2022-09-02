const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { log_edit,sequelize } = database;

exports.createLogEdit= (data) => {
    try {
      return log_edit.create(data);
    } catch (error) {
      throw error;
    }
};