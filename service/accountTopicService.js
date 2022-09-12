const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { account_topic, sequelize } = database;

exports.createAccountTopic = (data) => {
  try {
    return account_topic.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updateAccountTopic = (account_topic_id, payload) => {
  try {
    return account_topic.update(payload, {
      where: {
        account_topic_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};
