const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { message_connect, account, message, sequelize } = database;

exports.createMessageConnect = (data) => {
  try {
    return message_connect.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updateMessageConnect = (message_connect_id, payload) => {
  try {
    return message_connect.update(payload, {
      where: {
        message_connect_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};

exports.getMessageConnectByAccountId1AndAccountId2 = (payload) => {
  try {
    return message_connect.findOne({
      where: {
        is_delete: false,
        [Op.or]: [
          {
            [Op.and]: [
              { account_id_1: payload.account_id_1 },
              { account_id_2: payload.account_id_2 },
            ],
          },
          {
            [Op.and]: [
              { account_id_1: payload.account_id_2 },
              { account_id_2: payload.account_id_1 },
            ],
          },
        ],
      },
      attributes: [
        "message_connect_id",
        "last_messages",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: account,
          as: "account_1",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: message,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "message_id",
            "account_id",
            "is_read",
            "text",
            "createdAt",
            "updatedAt",
          ],
          order: [["message_id", "DESC"]],
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};

exports.getMessageConnectByMessageConnectId = (message_connect_id) => {
  try {
    return message_connect.findOne({
      where: {
        is_delete: false,
        message_connect_id,
      },
      attributes: [
        "message_connect_id",
        "last_messages",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: account,
          as: "account_1",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: message,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "message_id",
            "account_id",
            "is_read",
            "text",
            "createdAt",
            "updatedAt",
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};

exports.getAllMessageConnectByAccountId = (account_id) => {
  try {
    return message_connect.findAll({
      where: {
        is_delete: false,
        [Op.or]: [{ account_id_1: account_id }, { account_id_2: account_id }],
      },
      attributes: [
        "message_connect_id",
        "last_messages",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: account,
          as: "account_1",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "image_url"],
        },
        {
          model: message,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "message_id",
            "account_id",
            "is_read",
            "text",
            "createdAt",
            "updatedAt",
          ],
          limit: 3,
          order: [["message_id", "DESC"]],
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};
