const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { rating, account, sequelize } = database;

exports.createRating = (data) => {
  try {
    return rating.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getRatingByAccountIdAndAccountIdReviewer = (payload) => {
  try {
    return rating.findOne({
      where: {
        account_id: payload.account_id,
        account_id_reviewer: payload.account_id_reviewer,
        is_delete: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.updateRating = (rating_id, payload) => {
  try {
    return rating.update(payload, {
      where: {
        rating_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getRatingByAccountId = (account_id) => {
  try {
    return rating.findAll({
      where: {
        account_id,
        is_delete: false,
      },
      include: [
        {
          model: account,
          as: "account_reviewer",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "name", "role", "image_url"],
        },
      ],
      attributes: [
        "rating_id",
        "account_id",
        "account_id_reviewer",
        "created_at",
        "updated_at",
        "rating_score",
        "review",
      ],
    });
  } catch (error) {
    throw error;
  }
};
