const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { post, account, comment, post_tag, tag, emotion, log_edit, sequelize } =
  database;

function post_include(account_id = null) {
  return [
    {
      model: account,
      required: false,
      where: {
        is_delete: false,
      },
      attributes: ["account_id", "username", "name", "role", "image_url"],
    },
    {
      model: comment,
      required: false,
      where: {
        is_delete: false,
        reply_comment_id: null,
      },
      attributes: ["comment_id", "text", "createdAt", "updatedAt", "post_id"],
      include: [
        {
          model: account,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "name", "role", "image_url"],
        },
        {
          model: comment,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: [
            "comment_id",
            "text",
            "createdAt",
            "updatedAt",
            "post_id",
          ],
          include: [
            {
              model: account,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: [
                "account_id",
                "username",
                "name",
                "role",
                "image_url",
              ],
            },
            {
              model: emotion,
              required: false,
              where: {
                is_delete: false,
                is_emotion: true,
              },
              attributes: ["emotion_id"],
              include: [
                {
                  model: account,
                  required: false,
                  where: {
                    is_delete: false,
                  },
                  attributes: [
                    "account_id",
                    "username",
                    "name",
                    "role",
                    "image_url",
                  ],
                },
              ],
            },
            {
              model: log_edit,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: ["log_edit_id", "log_data", "createdAt"],
            },
          ],
        },
        {
          model: emotion,
          required: false,
          where: {
            is_delete: false,
            is_emotion: true,
          },
          attributes: ["emotion_id"],
          include: [
            {
              model: account,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: [
                "account_id",
                "username",
                "name",
                "role",
                "image_url",
              ],
            },
          ],
        },
        {
          model: log_edit,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["log_edit_id", "log_data", "createdAt"],
        },
      ],
    },
    {
      model: emotion,
      required: false,
      where: {
        is_delete: false,
        is_emotion: true,
      },
      attributes: ["emotion_id"],
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
    },
    {
      model: post_tag,
      required: false,
      where: {
        is_delete: false,
      },
      attributes: ["post_tag_id"],
      include: [
        {
          model: tag,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["tag_id", "tag_type", "name"],
        },
      ],
    },
    {
      model: post,
      as: "refer_post",
      required: false,
      where: {
        is_delete: false,
        [Op.or]: [
          { account_id: account_id },
          ,
          {
            publish_status: "Publish",
          },
        ],
      },
      attributes: [
        "post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
      ],
      include: [
        {
          model: account,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["account_id", "username", "name", "role", "image_url"],
        },
        {
          model: emotion,
          required: false,
          where: {
            is_delete: false,
            is_emotion: true,
          },
          attributes: ["emotion_id"],
          include: [
            {
              model: account,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: [
                "account_id",
                "username",
                "name",
                "role",
                "image_url",
              ],
            },
          ],
        },
        {
          model: post_tag,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["post_tag_id"],
          include: [
            {
              model: tag,
              required: false,
              where: {
                is_delete: false,
              },
              attributes: ["tag_id", "tag_type", "name"],
            },
          ],
        },
        {
          model: log_edit,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["log_edit_id", "log_data", "createdAt"],
        },
      ],
    },
    {
      model: post,
      as: "posts",
      required: false,
      where: {
        is_delete: false,
      },
      attributes: ["post_id"],
    },
    {
      model: log_edit,
      required: false,
      where: {
        is_delete: false,
      },
      attributes: ["log_edit_id", "log_data", "createdAt"],
    },
  ];
}

exports.createPost = (data) => {
  try {
    return post.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updatePost = (post_id, payload) => {
  try {
    return post.update(payload, {
      where: {
        post_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};

exports.getPostByPostId = (post_id, account_id = null) => {
  try {
    return post.findOne({
      where: {
        post_id,
        is_delete: false,
        [Op.or]: [
          { account_id: account_id },
          ,
          {
            publish_status: "Publish",
          },
        ],
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllPost = (account_id = null) => {
  try {
    return post.findAll({
      where: {
        is_delete: false,
        [Op.or]: [
          { account_id: account_id },
          ,
          {
            publish_status: "Publish",
          },
        ],
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllPostAccountPagination = (
  account_id,
  limit,
  offset,
  my_account_id = null
) => {
  try {
    return post.findAndCountAll({
      where: {
        is_delete: false,
        account_id: account_id,
        publish_status: "Publish",
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(my_account_id),
      limit: limit,
      offset: offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllPostPagination = (limit, offset, account_id = null) => {
  try {
    return post.findAndCountAll({
      where: {
        is_delete: false,
        [Op.or]: [
          { account_id: account_id },
          ,
          {
            publish_status: "Publish",
          },
        ],
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
      limit: limit,
      offset: offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllMyPost = (account_id) => {
  try {
    return post.findAll({
      where: {
        is_delete: false,
        account_id,
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllMyPostPagination = (account_id, limit, offset) => {
  try {
    return post.findAndCountAll({
      where: {
        is_delete: false,
        account_id,
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
      limit: limit,
      offset: offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllRepost = (refer_post_id, account_id = null) => {
  try {
    return post.findAll({
      where: {
        is_delete: false,
        refer_post_id,
        [Op.or]: [
          { account_id: account_id },
          ,
          {
            publish_status: "Publish",
          },
        ],
      },
      attributes: [
        "post_id",
        "refer_post_id",
        "text",
        "img",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include(account_id),
    });
  } catch (error) {
    throw error;
  }
};
