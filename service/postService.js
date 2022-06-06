const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { post, account, comment, post_tag, tag, emotion, sequelize } = database;

exports.createPost = (data) => {
  try {
    return post.create(data);
  } catch (error) {
    throw error;
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
          model: comment,
          required: false,
          where: {
            is_delete: false,
            reply_comment_id: null,
          },
          attributes: ["comment_id", "text", "createdAt", "post_id"],
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
              attributes: ["comment_id", "text", "createdAt", "post_id"],
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
            required: false,
            where: {
              is_delete: false,
            },
            attributes: ["post_id"],
        }
      ],
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
            model: comment,
            required: false,
            where: {
              is_delete: false,
              reply_comment_id: null,
            },
            attributes: ["comment_id", "text", "createdAt", "post_id"],
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
                attributes: ["comment_id", "text", "createdAt", "post_id"],
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
              required: false,
              where: {
                is_delete: false,
              },
              attributes: ["post_id"],
          }
        ],
      });
    } catch (error) {
      throw error;
    }
  };
  