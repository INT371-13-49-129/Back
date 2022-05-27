const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { tag,sequelize } = database;

exports.createTag= (data) => {
    try {
      return tag.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getAllTag= () => {
    try {
      return tag.findAll({
        where: {
            is_delete: false,
          },
        attributes: [
            'tag_id',
            'name',
            'tag_type'
          ],
      });
    } catch (error) {
      throw error;
    }
};