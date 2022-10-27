const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { mood, mood_diary, sequelize } = database;

exports.createMoodDiary = (data) => {
  try {
    return mood_diary.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getAllMoodDiary = (account_id) => {
  try {
    return mood_diary.findAll({
      where: {
        is_delete: false,
        account_id,
      },
      attributes: ["mood_diary_id", "date", "created_at"],
      include: [
        {
          model: mood,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["mood_id", "name", "mood_level", "icon", "color"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getMoodDiaryByMoodDiaryId = (mood_diary_id) => {
  try {
    return mood_diary.findOne({
      where: {
        is_delete: false,
        mood_diary_id,
      },
      attributes: ["mood_diary_id", "date", "created_at", "account_id"],
      include: [
        {
          model: mood,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["mood_id", "name", "mood_level", "icon", "color"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getMoodDiaryDate = (account_id, date) => {
  try {
    return mood_diary.findOne({
      where: {
        is_delete: false,
        account_id,
        date,
      },
      attributes: ["mood_diary_id", "date", "created_at"],
      include: [
        {
          model: mood,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["mood_id", "name", "mood_level", "icon", "color"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getMoodDiaryMonth = (account_id, date) => {
  try {
    return mood_diary.findAll({
      where: {
        is_delete: false,
        account_id,
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("date")),
            date.month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("date")),
            date.year
          ),
        ],
      },
      attributes: ["mood_diary_id", "date", "created_at"],
      include: [
        {
          model: mood,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["mood_id", "name", "mood_level", "icon", "color"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getMoodDiaryYear = (account_id, year) => {
  try {
    return mood_diary.findAll({
      where: {
        is_delete: false,
        account_id,
        [Op.and]: sequelize.where(
          sequelize.fn("YEAR", sequelize.col("date")),
          year
        ),
      },
      attributes: ["mood_diary_id", "date", "created_at"],
      include: [
        {
          model: mood,
          required: false,
          where: {
            is_delete: false,
          },
          attributes: ["mood_id", "name", "mood_level", "icon", "color"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.updateMoodDiary = (mood_diary_id, payload) => {
  try {
    return mood_diary.update(payload, {
      where: {
        mood_diary_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};