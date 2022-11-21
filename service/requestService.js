const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { request,sequelize } = database;

exports.createRequest= (data) => {
    try {
      return request.create(data);
    } catch (error) {
      throw error;
    }
};

exports.updateRequest= (request_id, payload) => {
    try {
      return request.update(payload, {
        where: {
          request_id,
          is_delete: false,
        },
      });
    } catch (e) {
      throw e;
    }
};

exports.getRequestByMessageConnectId = (message_connect_id) => {
    try {
      return request.findOne({
        where: {
          message_connect_id,
          request_status:"Waiting",
          is_delete: false,
        },
        attributes: [
          "request_id",
          "account_id",
          "text",
          "message_connect_id",
          "request_status",
          "createdAt",
          "updatedAt",
        ],
      });
    } catch (error) {
      throw error;
    }
  }