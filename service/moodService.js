const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { mood, sequelize } = database;

exports.createMood = (data) => {
  try {
    return mood.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getAllMood = () => {
  try {
    return mood.findAll({
      where: {
        is_delete: false,
      },
      attributes: ["mood_id", "name", "mood_level", "icon", "color"],
    });
  } catch (error) {
    throw error;
  }
};
