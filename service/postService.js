const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { post, account, comment, post_tag, tag, emotion, log_edit, sequelize } = database;

const post_include = [
  {
    model: account,
    required: false,
    where: {
      is_delete: false,
    },
    attributes: ["account_id", "username", "image_url"],
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
        attributes: ["account_id", "username", "image_url"],
      },
      {
        model: comment,
        required: false,
        where: {
          is_delete: false,
        },
        attributes: ["comment_id", "text", "createdAt", "updatedAt", "post_id"],
        include: [
          {
            model: account,
            required: false,
            where: {
              is_delete: false,
            },
            attributes: ["account_id", "username", "image_url"],
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
                attributes: ["account_id", "username", "image_url"],
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
            attributes: ["account_id", "username", "image_url"],
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
        attributes: ["account_id", "username", "image_url"],
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
    },
    attributes: [
      "post_id",
      "text",
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
        attributes: ["account_id", "username", "image_url"],
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
            attributes: ["account_id", "username", "image_url"],
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
            where: {
              is_delete: false,
            },
            attributes: ["tag_id", "tag_type", "name"],
          },
        ],
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

exports.getPostByPostId = (post_id) => {
  try {
    return post.findOne({
      where: {
        post_id,
        is_delete: false,
      },
      attributes: [
        "post_id",
        "text",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllPost = () => {
  try {
    return post.findAll({
      where: {
        is_delete: false,
      },
      attributes: [
        "post_id",
        "text",
        "post_type",
        "post_status",
        "publish_status",
        "createdAt",
        "updatedAt",
      ],
      include: post_include
    });
  } catch (error) {
    throw error;
  }
};
