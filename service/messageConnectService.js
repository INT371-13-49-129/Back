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
        "account_id_1",
        "account_id_2",
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
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
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
            "image_url",
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

exports.getMessageConnectByAccountId1AndAccountId2Pagination = (payload) => {
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
        "account_id_1",
        "account_id_2",
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
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
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
            "image_url",
            "createdAt",
            "updatedAt",
          ],
          limit: payload.limit,
          offset: payload.offset,
          distinct: true,
          order: [["createdAt", "DESC"]],
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
        "account_id_1",
        "account_id_2",
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
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
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
            "image_url",
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
        "account_id_1",
        "account_id_2",
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
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
        },
        {
          model: account,
          as: "account_2",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "account_id",
            "username",
            "name",
            "role",
            "is_listener",
            "image_url",
          ],
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
            "image_url",
            "createdAt",
            "updatedAt",
          ],
          limit: 3,
          order: [["createdAt", "DESC"]],
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};
