const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { account, account_topic, topic, post, follow, rating, sequelize } =
  database;

exports.createAccount = (data) => {
  try {
    return account.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getAccountByUsername = (username) => {
  try {
    return account.findOne({
      where: {
        username: username,
        is_delete: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getAccountByEmail = (email) => {
  try {
    return account.findOne({
      where: {
        email: email,
        is_delete: false,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getAccountByAccountId = (account_id) => {
  try {
    return account.findOne({
      where: {
        account_id: account_id,
        is_delete: false,
      },
      include: [
        {
          model: account_topic,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_topic_id"],
          include: [
            {
              model: topic,
              where: {
                is_delete: false,
              },
              attributes: ["topic_id", "name"],
            },
          ],
        },
        {
          model: post,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["post_id", "post_type"],
        },
        {
          model: follow,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["follow_id", "account_id", "created_at", "updated_at"],
        },
        {
          model: follow,
          required: false,
          as: "account_follower",
          where: {
            is_delete: false,
          },
          attributes: [
            "follow_id",
            "account_id_follower",
            "created_at",
            "updated_at",
          ],
        },
        {
          model: rating,
          as: "account_reviewer",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "rating_id",
            "account_id",
            "account_id_reviewer",
            "created_at",
            "updated_at",
            "rating_score",
            "review",
          ],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.updateAccount = (account_id, payload) => {
  try {
    return account.update(payload, {
      where: {
        account_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};

exports.getAllAccount = () => {
  try {
    return account.findAll({
      where: {
        is_delete: false,
      },
      attributes: [
        "account_id",
        "username",
        "name",
        "role",
        "image_url",
        "is_listener",
      ],
      include: [
        {
          model: account_topic,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_topic_id"],
          include: [
            {
              model: topic,
              where: {
                is_delete: false,
              },
              attributes: ["topic_id", "name"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllAccountPsychologistPagination = (account_id, limit, offset) => {
  try {
    return account.findAndCountAll({
      where: {
        is_delete: false,
        role: "Psychologist",
        account_id: {
          [Op.ne]: account_id,
        },
      },
      include: [
        {
          model: account_topic,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_topic_id"],
          include: [
            {
              model: topic,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: ["topic_id", "name"],
            },
          ],
        },
        {
          model: post,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["post_id", "post_type"],
        },
        {
          model: follow,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["follow_id", "account_id", "created_at", "updated_at"],
        },
        {
          model: follow,
          required: false,
          as: "account_follower",
          where: {
            is_delete: false,
          },
          attributes: [
            "follow_id",
            "account_id_follower",
            "created_at",
            "updated_at",
          ],
        },
        {
          model: rating,
          as: "account_reviewer",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "rating_id",
            "account_id",
            "account_id_reviewer",
            "created_at",
            "updated_at",
            "rating_score",
            "review",
          ],
        },
      ],
      limit,
      offset,
      distinct: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllAccountIsListenerPagination = (account_id, limit, offset) => {
  try {
    return account.findAndCountAll({
      where: {
        is_delete: false,
        is_listener: true,
        role:"Member",
        account_id: {
          [Op.ne]: account_id,
        },
      },
      include: [
        {
          model: account_topic,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_topic_id"],
          include: [
            {
              model: topic,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: ["topic_id", "name"],
            },
          ],
        },
        {
          model: post,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["post_id", "post_type"],
        },
        {
          model: follow,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["follow_id", "account_id", "created_at", "updated_at"],
        },
        {
          model: follow,
          required: false,
          as: "account_follower",
          where: {
            is_delete: false,
          },
          attributes: [
            "follow_id",
            "account_id_follower",
            "created_at",
            "updated_at",
          ],
        },
        {
          model: rating,
          as: "account_reviewer",
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "rating_id",
            "account_id",
            "account_id_reviewer",
            "created_at",
            "updated_at",
            "rating_score",
            "review",
          ],
        },
      ],
      limit,
      offset,
      distinct: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllAccountRequestPsychologist= () => {
  try {
    return account.findAll({
      where: {
        is_delete: false,
        role: "Member",
        approve: "Waiting",
      },
      attributes: {
        exclude: ["password"],
      },
    });
  } catch (error) {
    throw error;
  }
}
