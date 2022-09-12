const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { topic,sequelize } = database;

exports.createTopic= (data) => {
    try {
      return topic.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getAllTopic= () => {
    try {
      return topic.findAll({
        where: {
            is_delete: false,
          },
        attributes: [
            'topic_id',
            'name',
          ],
      });
    } catch (error) {
      throw error;
    }
};