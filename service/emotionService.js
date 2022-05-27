const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { emotion,sequelize } = database;

exports.createEmotion= (data) => {
    try {
      return emotion.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getEmotion = (payload) => {
    try {
      return emotion.findOne({
          where: payload
        }
      )
    } catch (e) {
      throw e
    }
}

exports.updateEmotionByEmotionId = (emotion_id,payload) => {
    try {
      return emotion.update(
        payload,
        {
          where: {
            emotion_id,
            is_delete: false,
          },
        }
      )
    } catch (e) {
      throw e
    }
}