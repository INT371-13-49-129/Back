const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { follow, account, sequelize } = database;

exports.createFollow = (data) => {
  try {
    return follow.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getFollowByAccountIdAndAccountIdFollower = (payload) => {
  try {
    return follow.findOne({
      where: {
        account_id: payload.account_id,
        account_id_follower: payload.account_id_follower,
        ...(payload.is_delete && {
          is_delete: payload.is_delete,
        }),
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.updateFollow = (follow_id, payload) => {
  try {
    return follow.update(payload, {
      where: {
        follow_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getFollowByAccountId = (account_id) => {
  try {
    return follow.findAll({
      where: {
        account_id,
        is_delete: false,
      },
      include: [
        {
          model: account,
          as: "account_follower",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "name", "role", "image_url"],
        },
      ],
      attributes: ["follow_id", "account_id_follower", "account_id","updatedAt"],
    });
  } catch (error) {
    throw error;
  }
};

exports.getFollowByAccountIdFollower = (account_id_follower) => {
  try {
    return follow.findAll({
      where: {
        account_id_follower,
        is_delete: false,
      },
      include: [
        {
          model: account,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "name", "role", "image_url"],
        },
      ],
      attributes: ["follow_id", "account_id_follower", "account_id","updatedAt"],
    });
  } catch (error) {
    throw error;
  }
};
