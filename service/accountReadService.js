const { Op } = require("sequelize");
const moment = require("moment");
const database = require("../config/database");
const { account_read, sequelize } = database;

exports.createAccountRead = (data) => {
  try {
    return account_read.create(data);
  } catch (error) {
    throw error;
  }
};

exports.getAccountReadByAccountIdAndPostId= (account_id,post_id) => {
  try {
    return account_read.findOne({
      where: {
          is_delete: false,
          account_id,
          post_id
        },
    });
  } catch (error) {
    throw error;
  }
};

exports.updateAccountRead = (account_read_id, payload) => {
  try {
    return account_read.update(payload, {
      where: {
        account_read_id,
        is_delete: false,
      },
    });
  } catch (e) {
    throw e;
  }
};
