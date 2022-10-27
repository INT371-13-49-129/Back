const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { diary, sequelize } = database;

exports.createDiary = (data) => {
  try {
    return diary.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getAllDiary = (account_id) => {
  try {
    return diary.findAll({
      where: {
        is_delete: false,
        account_id,
      },
      attributes: [
        "diary_id",
        "date",
        "title",
        "text",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getDiaryByDiaryId = (diary_id) => {
  try {
    return diary.findOne({
      where: {
        is_delete: false,
        diary_id,
      },
      attributes: [
        "diary_id",
        "date",
        "title",
        "text",
        "createdAt",
        "updatedAt",
        "account_id",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getDiaryDate = (account_id, date) => {
  try {
    return diary.findAll({
      where: {
        is_delete: false,
        account_id,
        date,
      },
      attributes: [
        "diary_id",
        "date",
        "title",
        "text",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getDiaryMonth = (account_id, date) => {
  try {
    return diary.findAll({
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
      attributes: [
        "diary_id",
        "date",
        "title",
        "text",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getDiaryYear = (account_id, year) => {
  try {
    return diary.findAll({
      where: {
        is_delete: false,
        account_id,
        [Op.and]: sequelize.where(
          sequelize.fn("YEAR", sequelize.col("date")),
          year
        ),
      },
      attributes: [
        "diary_id",
        "date",
        "title",
        "text",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.updateDiary = (diary_id, payload) => {
  try {
    return diary.update(payload, {
      where: {
        diary_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};
