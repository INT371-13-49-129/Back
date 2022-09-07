const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { message, message_connect, sequelize } = database;

exports.createMessage = (data) => {
  try {
    return message.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updateMessage = (message_id, payload) => {
  try {
    return message.update(payload, {
      where: {
        message_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};

exports.getMessage = (message_id) => {
  try {
    return message.findOne({
      where: {
        message_id,
        is_delete: false,
      },
      include: [
        {
          model: message_connect,
          required: false,
          where: {
            is_delete: false,
          },
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};
