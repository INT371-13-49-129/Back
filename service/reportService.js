const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { report,sequelize } = database;

exports.createReport= (data) => {
    try {
      return report.create(data);
    } catch (error) {
      throw error;
    }
};

exports.getAllReport= () => {
    try {
      return report.findAll({
        where: {
            is_delete: false,
          },
      });
    } catch (error) {
      throw error;
    }
}
